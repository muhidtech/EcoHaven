import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface User extends Record<string, unknown> {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt: string;
}

const usersFilePath = path.join(process.cwd(), 'public', 'data', 'users.json');

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
    await fs.access(usersFilePath);
  } catch {
    await fs.mkdir(path.dirname(usersFilePath), { recursive: true });
    await fs.writeFile(usersFilePath, JSON.stringify([]));
  }
}

// Load users from the file
async function loadUsers(): Promise<User[]> {
  await ensureUsersFile();
  const fileContent = await fs.readFile(usersFilePath, 'utf-8');
  return JSON.parse(fileContent) as User[];
}

// Save users to the file
async function saveUsers(users: User[]): Promise<void> {
  await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));
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

    const matchedUser = users.find((user) =>
      isEmail
        ? user.email === identifier && user.password === inputPassword
        : user.username === identifier && user.password === inputPassword
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
  try {
    const newUser = await request.json();
    console.log('Received new user data:', newUser);

    const requiredFields = ['username', 'firstName', 'lastName', 'email', 'password'];
    const missingFields = requiredFields.filter((field) => !newUser[field]);

    if (missingFields.length) {
      return NextResponse.json(
        { error: `Missing fields: ${missingFields.join(', ')}` },
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

    const userToAdd: User = {
      ...newUser,
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
    console.error('Error creating user:', error, error.stack);
    return NextResponse.json({ error: 'Failed to create user account.' }, { status: 500 });
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
