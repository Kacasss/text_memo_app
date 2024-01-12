import React, { useState, useEffect } from "react";
import { onAuthStateChanged, deleteUser } from "firebase/auth";
import { auth } from "./firebase";
import { useRouter } from 'next/router';

export default function DeleteUser() {
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

  // ユーザー削除処理
  const doDeleteUser = async () => {
    if (confirm("ユーザーを削除していいですか？")) {
      await deleteUser(user)
      .then(() => {
        alert("ユーザーが削除されました");
        router.push("/");
      }).catch((error) => {
        alert("ユーザー削除に失敗しました。時間をおいてもう一度削除して下さい");
      });
    }
  }

  return (
      <button className="btn btn-outline-secondary" onClick={ doDeleteUser }>ユーザー削除</button>
  )
}