import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../components/firebase";
import { doc, getDoc } from 'firebase/firestore/lite';
import Link from "next/link";
import { useRouter } from 'next/router';

import AfterLoginLayout from "../../components/afterLoginLayout";

export default function Edit() {
  // メモ情報を保持
  const [memos, setMemos] = useState([]);

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

          let date = new Date(memo.updatedAt);
          let time = (date.getMonth() + 1) + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes()

          // ログイン中のユーザー名とメモのユーザー名が一致の場合、
          // 更新・削除可能
          // 一致してない場合は、一覧画面に転送する
          if (user.displayName == memo.name) {
            setMemos(
              <tr key={ memo.id }>
                <td>{ memo.id }</td>
                <td>{ memo.name }</td>
                <td>{ memo.message }</td>
                <td>{ time }</td>
                <td>
                  <Link href={`update?id=${ memo.id }`}>
                    <button className="btn btn-primary">更新</button>
                  </Link>
                </td>
                <td>
                  <Link href={`delete?id=${ memo.id }`}>
                    <button className="btn btn-secondary">削除</button>
                  </Link>
                </td>
              </tr>
            );
          } else {
            router.push("/memos");
          }
        });
      }
    }
  }, [user]);

  return (
      <AfterLoginLayout title="編集画面">
        {/* ログインしている場合、ユーザー名表示 */}
        {user != null
        &&
          <p className="my-2">現在、{ user.displayName } さんがログイン中です</p>
        }
        <table className="table table-hover table-light my-3">
          <thead className="bg-primary text-light">
            <tr>
              <th>ID</th>
              <th>名前</th>
              <th>メッセージ</th>
              <th>日時</th>
              <th>更新</th>
              <th>削除</th>
            </tr>
          </thead>
          <tbody>
            { memos }
          </tbody>
        </table>
        <Link href="/memos">
          <button className="btn btn-primary">一覧に戻る</button>
        </Link>
      </AfterLoginLayout>
  )
}