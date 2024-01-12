import React, { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../components/firebase";
import Link from "next/link";
import { useRouter } from 'next/router';

import BeforeLoginLayout from "../components/beforeLoginLayout";

export default function Index() {

  const title = "Next.jsでメモアプリ";
  const text = "ログインかユーザー登録をしてください";
  
  const router = useRouter();

  // ログイン中か判定
  // ログインしている場合は、memos/index.jsへ転送
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser != null) {
        router.push("/memos");
      }
    });
  }, []);

  // 背景色を変更
  useEffect(() => {
    let body = document.getElementById('background-color');
    body.style.backgroundColor = "#ecebed";
  }, []);
 
  return (
    <BeforeLoginLayout>
      <div className="mb-4">
        <h2 className="card-title m-0 pb-3">{ title }</h2>
        <p className="card-text py-1">{ text }</p>
      </div>
      <div className="d-flex justify-content-between">
        <div className="link-group">
          <Link href="/auth/login">
            <button className="btn btn-outline-primary">
              ログインはこちら
            </button>
          </Link>
        </div>
        <div className="link-group">
          <Link href="/auth/register">
            <button className="btn btn-outline-success">
              ユーザー登録はこちら
            </button>
          </Link>
        </div>
      </div>
    </BeforeLoginLayout>
  )
}
