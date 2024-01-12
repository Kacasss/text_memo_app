import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../components/firebase";
import { doc, setDoc } from 'firebase/firestore/lite';
import Link from "next/link";
import { useRouter } from 'next/router';

import AfterLoginLayout from "../../components/afterLoginLayout";
import usePersist from "../../components/Persist";

export default function Add() {
  // メモのメッセージ欄
  const [message, setMessage] = useState("");

  // 追加するメモの個数をローカルストレージに保存
  const [count, setCount] = usePersist("count", 0);

  // ユーザー情報を保持
  const [user, setUser] = useState(null);
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

  // メモを追加
  const addMemo = ((e) => {
    // ページの再リロードをストップ
    e.preventDefault();

    // バリデーションチェック
    // エラーがあった場合は、アラートを出し、処理を中断
    if (message === "") {
      alert("メッセージを入力して下さい");
      return;
    }

    // メモ内容をオブジェクトに保存
    const memo = {
      id: count,
      name: user.displayName,
      message: message,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime()
    };

    // メモをfirebaseに追加
    setDoc(doc(db, "memos", String(count)), memo)
    .then((result) => {
      alert("追加しました")
      // ローカルストレージに今の数字に1を追加
      setCount(count + 1);

      router.push('/memos');
    });
  });

  return (
    <AfterLoginLayout title="メモ追加">
      {/* ログインしている場合、ユーザー名表示 */}
      {user != null
      &&
        <p className="my-2">現在、{ user.displayName } さんがログイン中です</p>
      }
      <div className="alert alert-light">
        <div className="text-left">
          <form onSubmit={ addMemo }>
            <div className="form-group">
              <label>名前：</label>
              {user != null
              &&
              <p>{ user.displayName }</p>
              }
            </div>
            <div className="form-group">
              <label>メッセージ：</label>
              <input type="text" onChange={ (e) => setMessage(e.target.value) } value={ message } className="form-control" />
            </div>
            <button className="btn btn-primary">
              メモ追加
            </button>
          </form>
        </div>
      </div>
      <Link href="/memos">
        <button className="btn btn-primary">一覧に戻る</button>
      </Link>
    </AfterLoginLayout>
  )
}