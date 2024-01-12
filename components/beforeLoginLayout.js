import React from "react";
import Head from "next/head";

export default function beforeLoginLayout(props) {
  const title = "Next.jsでメモアプリ";

  return (
    <div>
      <Head>
        <title>{ title }</title>
      </Head>
      {/* ここからボディ情報 */}
      <div className="container d-flex justify-content-center mt-5">
        <div className="card" style={{width: 30 + 'rem'}}>
          <div className="card-body">
            <div className="card-children">
              {/* authのlogin,register, index.js */}
              { props.children }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
