'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function Home() {
  const [status, setStatus] = useState('接続中...');

  useEffect(() => {
    const test = async () => {
      try {
        const result = await getDocs(collection(db, 'test'));
        setStatus(`✅ Firebase 接続成功！`);
      } catch (error) {
        setStatus(`❌ エラー: ${error}`);
      }
    };
    test();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">salon-booking</h1>
        <p className="text-2xl text-blue-600">{status}</p>
      </div>
    </div>
  );
}