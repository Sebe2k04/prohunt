const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const supabase = require("../supabase");

const signup = async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) return res.status(400).json({ error: error.message });

  await supabase
    .from("users")
    .insert([{ email, role: "user", password: hashedPassword }]);
  res.json({ message: "User registered successfully", user: data });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !user) return res.status(404).json({ error: "User not found" });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid)
    return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  res.json({ token });
};

const googleAuth = async (req, res) => {
  const { id_token } = req.body;

  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: "google",
    token: id_token,
  });

  if (error) return res.status(400).json({ error: error.message });
  res.json({ user: data });
};
module.exports = { signup, login, googleAuth };
