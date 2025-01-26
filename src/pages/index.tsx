import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import { createTheme, ThemeProvider } from "@mui/material";

import Main from '../components/main';
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
    <body className="init-body"></body>
    </>
  )
}