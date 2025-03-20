import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const usersFilePath = path.join(process.cwd(), 'data', 'users.json');

// Ensure the users file exists
async function ensureUsersFile() {
  try {
    await fs.access(usersFilePath);
  } catch (error) {
    await fs.mkdir(path.dirname(usersFilePath), { recursive: true });
    await fs.writeFile(usersFilePath, JSON.stringify([]));
  }
}

// GET handler to retrieve all users
export async function GET(request: NextRequest) {
  try {
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const identifier = searchParams.get('identifier');
    const password = searchParams.get('password');

    // Validate parameters
    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'Both identifier and password are required.' },
        { status: 400 }
      );
    }

    await ensureUsersFile();

    // Load users from file
    const fileContent = await fs.readFile(usersFilePath, 'utf-8');
    const users = JSON.parse(fileContent);

    // Identify if input is an email or username
    const isEmail = identifier.includes('@');

    // Validate input format
    if (isEmail) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(identifier)) {
        return NextResponse.json({ error: 'Invalid email format.' }, { status: 400 });
      }
    } else {
      const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
      if (!usernameRegex.test(identifier)) {
        return NextResponse.json({ error: 'Invalid username format.' }, { status: 400 });
      }
    }

    // Find matching user
    const user = users.find((user: any) => {
      if (isEmail) {
        return user.email === identifier && user.password === password;
      }
      return user.username === identifier && user.password === password;
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    // Return user data (omit sensitive info in production)
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('Error retrieving user accounts:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve user accounts.' },
      { status: 500 }
    );
  }
}

// POST handler to add a new user
export async function POST(request: NextRequest) {
  try {
    const newUser = await request.json();

    const requiredFields = ['username', 'firstName', 'lastName', 'email', 'password'];
    const missingFields = requiredFields.filter(field => !newUser[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required user information: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    await ensureUsersFile();

    const fileContent = await fs.readFile(usersFilePath, 'utf-8');
    const users = JSON.parse(fileContent);

    const userExists = users.some(
      (user: any) => user.username === newUser.username || user.email === newUser.email
    );

    if (userExists) {
      return NextResponse.json(
        { error: 'Username or email already exists' },
        { status: 409 }
      );
    }

    const userToAdd = {
      ...newUser,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    users.push(userToAdd);

    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));

    return NextResponse.json(
      { message: 'User account created successfully', user: userToAdd },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user account:', error);
    return NextResponse.json(
      { error: `Failed to create user account: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
