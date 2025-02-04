import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import loadable from '@loadable/component';
import { createTheme, ThemeProvider } from "@mui/material";

const Main = loadable(() => import('../components/main'))
import '../css/index.css';


export default function IndexPage() {
  const typo = createTheme({
    typography: {
      fontFamily: 'Pretendard-Regular',
      fontSize: 18,
    }
  })
  return (
    <div>
      <ThemeProvider theme={typo}>
        <Main />
      </ThemeProvider>
    </div>
  )
}

export const Head = () => {
  return (
    <>
    <title>벽람항로 스탯 기록기</title>
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'" />
    <body className="init-body"></body>
    </>
  )
}