import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged, updateProfile } from "firebase/auth";
import { auth } from "../../components/firebase";
import Link from "next/link";
import { useRouter } from 'next/router';

import BeforeLoginLayout from "../../components/beforeLoginLayout";

export default function Register() {
  const title = "ユーザー登録";

  // ユーザー名、メールアドレス、パスワードの入力値を保持
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // フォームでのエラー内容を保持
  let errors = [];
  const [errorForm, setErrorForm] = useState(errors);

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
    body.style.backgroundColor = "#b8eab9";
  }, []);

  // ユーザー登録をクリックしたら、登録の判定
  const handleSubmit = async (event) => {
    // ページの再リロードをストップ
    event.preventDefault();

    // エラー内容を初期化
    errors = [];
    setErrorForm(errors);

    // バリデーションチェック
    // エラーがあった場合は、配列でエラー内容を追加
    if (name === null || name === "") {
      errors.push("ユーザー名を入力してください");
    } else if (name.length < 4) {
      errors.push("ユーザー名は4文字以上入力してください");
    }

    if (email === null || email === "") {
      errors.push("メールアドレスを入力してください");
    }

    if (password === null || password === "") {
      errors.push("パスワードを入力してください");
    } else if (password.length < 8) {
      errors.push("パスワードは8文字以上入力してください");
    }

    setErrorForm(errors);

    // バリデーションでエラーがあった場合は、
    // ユーザー登録を行う前に処理を止める
    if (0 < errors.length) {
      return;
    }

    // ユーザー登録処理
    await createUserWithEmailAndPassword(auth, email, password)
    .then((result) => {

      // ユーザー名の登録
      updateProfile(auth.currentUser, {
        displayName: name
      }).then(() => {
        alert("ユーザーを登録しました");
        router.push("/memos");
      }).catch((error) => {
      // errors.pushでやると、useStateで更新されない為
      // スプレッド構文で作業。

      // ユーザー名の登録の失敗
      setErrorForm([...errors, "ユーザー名を登録できませんでした"]);
      });
      
      // メールアドレス、パスワードの登録の失敗
    }).catch((error) => {
      setErrorForm([...errors, "ユーザー情報を登録できませんでした"]);
    });
  };

  return (
    <BeforeLoginLayout>
      <div>
        <div>
          <h1 className="pb-3 h3">{ title }</h1>
          {/* バリデーションエラーがあった場合表示 */}
          {0 < errorForm.length
          &&
            (
              <div className="alert alert-danger" role="alert">
                {errorForm.map((error, index) => (
                  <div key={ index }>
                    <p>{ error }</p>
                  </div>
                  )
                )}
              </div>
            )
          }
          <form onSubmit={ handleSubmit }  className="mb-4">
            <div className="form-group">
              <label htmlFor="name">ユーザー名</label>
              <input id="name" name="name" type="name" value={ name }
              onChange={ (e) => setName(e.target.value) }
              className="form-control" />
            </div>
            <div className="form-group">
              <label htmlFor="email">メールアドレス</label>
              <input id="email" name="email" type="text" value={ email }
              onChange={ (e) => setEmail(e.target.value) }
              className="form-control" />
            </div>
            <div className="form-group">
              <label htmlFor="password">パスワード</label>
              <input id="password" name="password" type="password" value={ password }
              autoComplete="off"
              onChange={ (e) => setPassword(e.target.value) }
              className="form-control" />
            </div>
            <div>
              <button className="btn btn-outline-success">ユーザー登録</button>
            </div>
          </form>
        </div>
        <Link href="/">
          トップページへ戻る
        </Link>
      </div>
    </BeforeLoginLayout>
  )
}