import React, { useEffect } from "react";

import Header from "./Header"
import Footer from "./Footer"
import Logout from "./logout";
import DeleteUser from "./deleteUser";
import Head from "next/head";

export default function afterLoginLayout(props) {
  // ログイン後の背景色を設定
  useEffect(() => {
    let body = document.getElementById('background-color');
    body.style.backgroundColor = "#f1f3f4";
  }, []);

  return (
    <div className="text-center">
      <Head>
        <title>{ props.title }</title>
      </Head>
      {/* ここからボディ情報 */}
      <Header title={ props.title } />
      <div className="container text-center">
        {/* memosのindex, add, edit, update, delete */}
        <div>
          { props.children }
        </div>
        <div className="my-3 d-flex justify-content-between">
          <Logout />
          <DeleteUser />
        </div>
      </div>
      <Footer footer="copyright MemoAppPractice." />
    </div>
  )
}
