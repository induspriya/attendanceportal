export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, name } = req.body;

    // Basic validation
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // For now, just return success with mock user data (we'll implement actual user creation later)
    const mockUser = {
      id: '1',
      email: email,
      name: name,
      role: 'user',
      createdAt: new Date().toISOString()
    };

    const mockToken = 'dummy-token-' + Date.now();

    res.status(200).json({
      success: true,
      message: 'User registered successfully',
      token: mockToken,
      user: mockUser
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 