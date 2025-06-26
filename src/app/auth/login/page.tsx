"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        toast.error(error.message || "Login failed");
      } else {
        toast.success("Login successful!");
        router.push('/admin');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || "An unexpected error occurred");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center w-full justify-center min-h-screen bg-gradient-to-br from-[#20d5c7] to-[#1bb5a7]">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <Image src="/images/logo.png" alt="TrustLockd Logo" width={120} height={40} priority />
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#20d5c7]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#20d5c7]"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-[#20d5c7] hover:bg-[#1bb5a7] text-white py-3 rounded-lg font-semibold transition"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
