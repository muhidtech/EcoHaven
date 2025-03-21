import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    // Read the request body
    const body = await request.json();
    
    // Validate that products array is provided
    if (!body.products || !Array.isArray(body.products)) {
      return NextResponse.json(
        { error: 'Products array is required' },
        { status: 400 }
      );
    }
    
    // Define the file path
    const filePath = path.join(process.cwd(), 'public', 'products.json');
    
    // Write the products array to the file
    await fs.writeFile(
      filePath,
      JSON.stringify(body.products, null, 2),
      'utf-8'
    );
    
    // Return success response
    return NextResponse.json(
      { success: true, message: 'Products saved successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error saving products to file:', error);
    
    return NextResponse.json(
      { error: 'Failed to save products to file', details: (error as Error).message },
      { status: 500 }
    );
  }
}