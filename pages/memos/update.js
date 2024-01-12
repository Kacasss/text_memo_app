import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../components/firebase";
import { doc, getDoc, setDoc } from 'firebase/firestore/lite';
import Link from "next/link";
import { useRouter } from 'next/router';

import AfterLoginLayout from "../../components/afterLoginLayout";

export default function Update() {
  // メモ情報を保持
  const [memos, setMemos] = useState([]);

  // メモのメッセージ欄、更新日時
  const [message, setMessage] = useState("");
  const [createdAt, setCreatedAt] = useState(0);
  const [updatedAt, setUpdatedAt] = useState(0);

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


  useEffect(() => {
    // ログインしてるか確認。
    // ログインしている場合はメモを取り出す。
    if (user != null) {

      // idが定義されているか確認。
      // firebaseから1件分のメモを取り出す。
      if (router.query.id != undefined) {
        getDoc(doc(db, 'memos', router.query.id))
        .then((getMemo) => {
          const memo = getMemo.data();

          setMessage(memo.message);
          setCreatedAt(memo.createdAt);
          setUpdatedAt(memo.updatedAt);

          setMemos(memo);
        });
      }
      
    }
  }, []);
  
  // メモを更新
  const updateMemo = ((e) => {
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
      id: router.query.id,
      name: user.displayName,
      message: message,
      createdAt: createdAt,
      updatedAt: new Date().getTime()
    };

    // メモをfirebaseに更新
    setDoc(doc(db, "memos", router.query.id), memo)
    .then((result) => {
      alert("更新しました")
      router.push('/memos');
    });
  });



  return (
    <AfterLoginLayout title="メモ更新">
      {/* ログインしている場合、ユーザー名表示 */}
      {user != null
      &&
        <p className="my-2">現在、{ user.displayName } さんがログイン中です</p>
      }
      <div className="alert alert-light">
        <div className="text-left">
          <form onSubmit={ updateMemo } >
            <div className="form-group">
              <label>名前：</label>
              {user != null
              &&
              <p>{ user.displayName }</p>
              }
            </div>
            <div className="form-group">
              <label>メッセージ：</label>
              <input type="text" onChange={ (e) => setMessage(e.target.value) } value={ message != null ? message : "" } className="form-control" />
            </div>
            <button className="btn btn-primary">
              メモ更新
            </button>
          </form>
        </div>
      </div>
      <div className="my-3 d-flex justify-content-between">
        <Link href="/memos">
          <button className="btn btn-primary">一覧に戻る</button>
        </Link>
        <Link href={`edit?id=${ router.query.id }`}>
          <button className="btn btn-secondary">編集に戻る</button>
        </Link>
      </div>
    </AfterLoginLayout>
  )
}