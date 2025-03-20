  import { NextRequest, NextResponse } from 'next/server';
  import { promises as fs } from 'fs';
  import path from 'path';

  // Update to the correct path (writable location in the app directory)
  const usersFilePath = path.join(process.cwd(), 'public', 'data', 'users.json');

  // Ensure the users file exists or create it if missing
  async function ensureUsersFile() {
    try {
      await fs.access(usersFilePath);
    } catch {
      await fs.mkdir(path.dirname(usersFilePath), { recursive: true });
      await fs.writeFile(usersFilePath, JSON.stringify([]));
    }
  }

  // Helper function to load users from the file
  async function loadUsers() {
    await ensureUsersFile();
    const fileContent = await fs.readFile(usersFilePath, 'utf-8');
    return JSON.parse(fileContent);
  }

  // Helper function to save users to the file
  async function saveUsers(users: any[]) {
    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));
  }

  // ✅ GET handler – Retrieve users or authenticate a user
  export async function GET(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url);
      const identifier = searchParams.get('identifier');
      const password = searchParams.get('password');

      if (!identifier || !password) {
        return NextResponse.json(
          { error: 'Both identifier and password are required.' },
          { status: 400 }
        );
      }

      const users = await loadUsers();

      // Determine if identifier is an email or username
      const isEmail = identifier.includes('@');
      const matchedUser = users.find((user: any) =>
        isEmail
          ? user.email === identifier && user.password === password
          : user.username === identifier && user.password === password
      );

      if (!matchedUser) {
        return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
      }

      // Return the user (omit sensitive fields in production)
      const { password: _, ...userWithoutPassword } = matchedUser;
      return NextResponse.json({ user: userWithoutPassword }, { status: 200 });
    } catch (error) {
      console.error('Error retrieving user accounts:', error);
      return NextResponse.json({ error: 'Failed to retrieve user accounts.' }, { status: 500 });
    }
  }

  // ✅ POST handler – Create a new user
  export async function POST(request: NextRequest) {
    try {
      const newUser = await request.json();

      const requiredFields = ['username', 'firstName', 'lastName', 'email', 'password'];
      const missingFields = requiredFields.filter((field) => !newUser[field]);

      if (missingFields.length) {
        return NextResponse.json(
          { error: `Missing fields: ${missingFields.join(', ')}` },
          { status: 400 }
        );
      }

      const users = await loadUsers();

      // Check if username or email already exists
      const userExists = users.some(
        (user: any) => user.username === newUser.username || user.email === newUser.email
      );

      if (userExists) {
        return NextResponse.json(
          { error: 'Username or email already exists.' },
          { status: 409 }
        );
      }

      // Create new user object
      const userToAdd = {
        ...newUser,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      users.push(userToAdd);
      await saveUsers(users);

      const { password: _, ...userWithoutPassword } = userToAdd;

      return NextResponse.json(
        { message: 'User account created successfully.', user: userWithoutPassword },
        { status: 201 }
      );
    } catch (error) {
      console.error('Error creating user:', error);
      return NextResponse.json({ error: 'Failed to create user account.' }, { status: 500 });
    }
  }

  // ✅ PATCH handler – Update a user by ID
  export async function PATCH(request: NextRequest) {
    try {
      const { id, ...updates } = await request.json();

      if (!id) {
        return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
      }

      const users = await loadUsers();
      const userIndex = users.findIndex((user: any) => user.id === id);

      if (userIndex === -1) {
        return NextResponse.json({ error: 'User not found.' }, { status: 404 });
      }

      // Update user fields
      users[userIndex] = { ...users[userIndex], ...updates };
      await saveUsers(users);

      const { password: _, ...updatedUser } = users[userIndex];
      return NextResponse.json(
        { message: 'User updated successfully.', user: updatedUser },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error updating user:', error);
      return NextResponse.json({ error: 'Failed to update user.' }, { status: 500 });
    }
  }

  // ✅ DELETE handler – Delete a user by ID
  export async function DELETE(request: NextRequest) {
    try {
      const { id } = await request.json();

      if (!id) {
        return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
      }

      const users = await loadUsers();
      const filteredUsers = users.filter((user: any) => user.id !== id);

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
