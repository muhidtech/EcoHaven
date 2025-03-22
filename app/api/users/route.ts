import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

interface User extends Record<string, unknown> {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt: string;
}

// Use /tmp directory in production to ensure write access
const usersFilePath = process.env.NODE_ENV === 'production'
  ? path.join('/tmp', 'users.json')
  : path.join(process.cwd(), 'public', 'data', 'users.json');

console.log(`Using users file path: ${usersFilePath}`);

// Utility to omit specific keys from an object
function omit<T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result;
}

// Ensure the users file exists
async function ensureUsersFile() {
  try {
    console.log(`Checking if users file exists at: ${usersFilePath}`);
    await fs.access(usersFilePath);
    console.log('Users file exists');
  } catch (error) {
    console.log(`Uses file not found: ${error}`)
    console.log(`Creating directory: ${path.dirname(usersFilePath)}`);
    await fs.mkdir(path.dirname(usersFilePath), { recursive: true });
    console.log(`Creating empty users file at: ${usersFilePath}`);
    await fs.writeFile(usersFilePath, JSON.stringify([]));
    console.log('Empty users file created successfully');
  }
}

// Load users from the file
async function loadUsers(): Promise<User[]> {
  console.log('Loading users from file');
  await ensureUsersFile();
  console.log(`Reading users file from: ${usersFilePath}`);
  const fileContent = await fs.readFile(usersFilePath, 'utf-8');
  const users = JSON.parse(fileContent) as User[];
  console.log(`Loaded ${users.length} users from file`);
  return users;
}

// Save users to the file
async function saveUsers(users: User[]): Promise<void> {
  console.log(`Saving ${users.length} users to file: ${usersFilePath}`);
  try {
    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));
    console.log('Users saved successfully');
  } catch (error) {
    console.error(`Error saving users to file: ${error instanceof Error ? error.message : error}`);
    throw error; // Re-throw to be handled by the calling function
  }
}

// Hash password using Node.js crypto module
function hashPassword(password: string): string {
  try {
    return crypto.createHash('sha256').update(password).digest('hex');
  } catch (error) {
    console.error('Error hashing password:', error);
    throw new Error('Failed to hash password');
  }
}

// Handle GET requests (Authenticate user or get all users)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const identifier = searchParams.get('identifier');
    const inputPassword = searchParams.get('password');

    // If both identifier and password are missing, return all users (admin context)
    if (!identifier && !inputPassword) {
      const users = await loadUsers();
      const usersWithoutPasswords = users.map(user => omit(user, ['password']));
      return NextResponse.json({ users: usersWithoutPasswords }, { status: 200 });
    }

    // If only one parameter is provided but not both
    if (!identifier || !inputPassword) {
      return NextResponse.json(
        { error: 'Both identifier and password are required for authentication.' },
        { status: 400 }
      );
    }

    const users = await loadUsers();
    const isEmail = identifier.includes('@');
    
    // Hash the input password for comparison
    const hashedInputPassword = hashPassword(inputPassword);
    console.log('Authenticating user with hashed password');

    const matchedUser = users.find((user) =>
      isEmail
        ? user.email === identifier && user.password === hashedInputPassword
        : user.username === identifier && user.password === hashedInputPassword
    );

    if (!matchedUser) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    const userWithoutPassword = omit(matchedUser, ['password']);
    return NextResponse.json({ user: userWithoutPassword }, { status: 200 });
  } catch (error) {
    console.error('Error retrieving user accounts:', error);
    return NextResponse.json({ error: 'Failed to retrieve user accounts.' }, { status: 500 });
  }
}

// Handle POST requests (Create a new user)
export async function POST(request: NextRequest) {
  console.log('Starting user creation process');
  try {
    const newUser = await request.json();
    console.log('Received new user data:', newUser);
    console.log('Required fields check:', {
      username: !!newUser.username,
      firstName: !!newUser.firstName,
      lastName: !!newUser.lastName,
      email: !!newUser.email,
      password: !!newUser.password
    });

    const requiredFields = ['username', 'firstName', 'lastName', 'email', 'password'];
    const missingFields = requiredFields.filter((field) => !newUser[field]);

    if (missingFields.length) {
      return NextResponse.json(
        { error: `Missing fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const users = await loadUsers();
    const userExists = users.some(
      (user) => user.username === newUser.username || user.email === newUser.email
    );

    if (userExists) {
      return NextResponse.json(
        { error: 'Username or email already exists.' },
        { status: 409 }
      );
    }

    // Hash the password before storing
    console.log('Hashing password for new user');
    const hashedPassword = hashPassword(newUser.password);
    console.log('Password hashed successfully');

    const userToAdd: User = {
      ...newUser,
      password: hashedPassword,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    users.push(userToAdd);
    await saveUsers(users);

    const userWithoutPassword = omit(userToAdd, ['password']);
    return NextResponse.json(
      { message: 'User account created successfully.', user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error instanceof Error ? error.message : error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace available');
    
    // Provide more detailed error in development mode
    const isDev = process.env.NODE_ENV === 'development';
    const errorMessage = isDev && error instanceof Error 
      ? `Failed to create user account: ${error.message}` 
      : 'Failed to create user account.';
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// Handle PATCH requests (Update a user)
export async function PATCH(request: NextRequest) {
  try {
    const { id, ...updates } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
    }

    const users = await loadUsers();
    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    users[userIndex] = { ...users[userIndex], ...updates };
    await saveUsers(users);

    const updatedUser = omit(users[userIndex], ['password']);
    return NextResponse.json(
      { message: 'User updated successfully.', user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user.' }, { status: 500 });
  }
}

// Handle DELETE requests (Delete a user)
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
    }

    const users = await loadUsers();
    const filteredUsers = users.filter((user) => user.id !== id);

    if (users.length === filteredUsers.length) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    await saveUsers(filteredUsers);
    return NextResponse.json(
      { message: 'User deleted successfully.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user.' }, { status: 500 });
  }
}

