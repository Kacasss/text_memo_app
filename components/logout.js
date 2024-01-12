import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import { useRouter } from 'next/router';

export default function Logout() {
  // ユーザー情報を保持
  const [user, setUser] = useState("");
  const router = useRouter();

  // ログイン中か判定
  // ログインしている場合は、userを保存
  // ログインしていない場合は、index.jsへ転送
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser != null) {
        setUser(currentUser);
      } else {
        router.push("/");
      }
    });
  }, []);

  // ログアウト処理
  const logout = async () => {
    if (confirm("ログアウトしていいですか？")) {
      await signOut(auth)
      .then(() => {
        alert("ログアウトしました");
      }).catch((error) => {
        alert("ログアウトに失敗しました");
      });
      router.push("/");
    }
  }

  return (
    <button className="btn btn-outline-primary" onClick={ logout }>ログアウト</button>
  )
}