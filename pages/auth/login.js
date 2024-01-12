import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../components/firebase";
import Link from "next/link";
import { useRouter } from 'next/router';

import BeforeLoginLayout from "../../components/beforeLoginLayout";

export default function Login() {
  const title = "ログイン";

  // メールアドレス、パスワードの入力値を保持
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
    body.style.backgroundColor = "#cee9f9";
  }, []);

  // ログインをクリックしたら、ログイン認証の判定
  const handleSubmit = async (event) => {
    // ページの再リロードをストップ
    event.preventDefault();

    // エラー内容を初期化
    errors = [];
    setErrorForm(errors);

    // バリデーションチェック
    // エラーがあった場合は、配列でエラー内容を追加
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
    // ログイン認証を行う前に処理を止める
    if (0 < errors.length) {
      return;
    }

    // ログイン認証処理
    await signInWithEmailAndPassword(auth, email, password)
    .then((result) => {
      alert("ログインしました");
      router.push("/memos");
    }).catch((error) => {
      // errors.pushでやると、useStateで更新されない為
      // スプレッド構文で作業。
      setErrorForm([...errors, "メールアドレスかパスワードが相違しています"]);
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
              <label htmlFor="email">メールアドレス</label>
              <input id="email" name="email" type="text" value={ email }
              onChange={ (e) => setEmail(e.target.value) }
              className="form-control" />
            </div>
            <div className="form-group">
              <label htmlFor="password">パスワード</label>
              <input id="password" name="password" type="password" value={ password }
              onChange={ (e) => setPassword(e.target.value) }
              className="form-control" />
            </div>
              <button className="btn btn-outline-primary">ログイン</button>
          </form>
        </div>
        <Link href="/">
          トップページへ戻る
        </Link>
      </div>
    </BeforeLoginLayout>
  )
}