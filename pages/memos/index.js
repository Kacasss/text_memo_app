import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../components/firebase";
import { collection, getDocs } from 'firebase/firestore/lite';
import Link from "next/link";
import { useRouter } from 'next/router';

import AfterLoginLayout from "../../components/afterLoginLayout";

export default function Index() {
  // メモ情報を保持
  const memoData = [];
  const [memos, setMemos] = useState(memoData);

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
    // メモ内容を初期化
    setMemos([]);

    // ログインしてるか確認。
    // ログインしている場合はメモを取り出す。
    if (user != null) {
      getDocs(collection(db, 'memos'))
      .then((memos) => {
        memos.forEach((getMemo) => {
          const memo = getMemo.data();

          let date = new Date(memo.updatedAt);
          let time = (date.getMonth() + 1) + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes()

          // 1メモずつ、配列に追加
          memoData.push(
            <tr key={ memo.id }>
              <td>{ memo.id }</td>
              <td>{ memo.name }</td>
              <td>{ memo.message }</td>
              <td>{ time }</td>

              {/* ログイン中のユーザー名とメモのユーザー名が一致の場合、編集可 */}
              {user.displayName == memo.name
              ?
                <td>
                  <Link href={`memos/edit?id=${ memo.id }`}>
                    <button className="btn btn-primary">編集</button>
                  </Link>
                </td>
              :
                <td>
                </td>
              }
            </tr>
          );
        });

        setMemos(memoData);
      });
    }
  }, [user]);

  return (
    <AfterLoginLayout title="一覧画面">
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
            <th>編集</th>
          </tr>
        </thead>
        <tbody>
          { memos }
        </tbody>
      </table>
      <Link href="memos/add">
        <button className="btn btn-primary">メモ追加</button>
      </Link>
    </AfterLoginLayout>
  )
}