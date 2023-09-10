"use client";

import { useState, useEffect, MouseEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  Typography,
  IconButton,
  Avatar,
  Button,
  MenuItem,
} from "@mui/material";
// import { AccountCircleRounded } from "@mui/icons-material/";
// import styled from "@emotion/styled";
import Image from "next/image";
import Link from "next/link";
// import jwtDecode from "jsonwebtoken/decode";
import Cookies from "universal-cookie";
import { PAGES, USERS } from "@/components/utils/Constant";
// `;
import axios from "axios";
import { styled } from "@mui/system";
import useCurrentUser from "@/components/utils/useCurrentUser";

const Wrapper = styled("div")({
  padding: "30px 30px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  position: "sticky",
  top: 0,
  zIndex: 999,
  backgroundColor: "#f2f2f2",
});
const Logo = styled("div")({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
});
const Nav = styled("div")({
  display: "flex",
  flexDirection: "row",
  width: "40%",
  justifyContent: "space-between",
  alignItems: "center",
});

export default function Header() {
  const { userData, mutate } = useCurrentUser();

  const [userRole, setUserRole] = useState("admin");
  // const [userRole, setUserRole] = useState("user");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentMenu, setCurrentMenu] = useState("");

  const router = useRouter();
  const open = Boolean(anchorEl);
  const cookies = new Cookies();

  const onClickLogout = async () => {
    cookies.remove("name");
    cookies.remove("token");
    // cookies.remove('userid');
    cookies.remove("employee_num");
    setAnchorEl(null);
    mutate(null, false); // 다음 서버 요청 발생 전까지 기존 값 유지 되기 때문에 null로 처리
    // await router.push("/login");
    window.location.href = "/login";
  };

  useEffect(() => {
    if (userData) {
      // console.log("Current user data:", userData);
      axios.defaults.withCredentials = true; // credential:true 추가
      axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*"; // access-control-allow-origin 추가
      axios.defaults.headers.common["SameSite"] = "none"; // samesite=none 추가
      axios.defaults.headers.common["secure"] = true; // secure=true 추가
      return;
    }
  }, [userData]);

  // useEffect(() => {
  //   const jwtToken = cookies.get("jwt"); // 쿠키에서 JWT 토큰 가져오기

  //   if (jwtToken) {
  //     // 실제 애플리케이션에서는 서버로 요청을 보내서 JWT 토큰을 해석하고
  //     // 그 결과로 받은 사용자 정보(예: 이름)를 setUsername 함수로 설정

  //     setUsername("사용자 이름");
  //   }
  // }, []);
  // useEffect(() => {
  //   const jwtToken = cookies.get("jwt"); // 쿠키에서 JWT 토큰 가져오기

  //   if (jwtToken) {
  //     const decodedToken = jwtDecode(jwtToken);
  //     setUsername(decodedToken.username);
  //     setUserRole(decodedToken.role);
  //   }
  // }, []);
  // useEffect(() => {
  //   const jwtToken = cookies.get("jwt"); // 쿠키에서 JWT 토큰 가져오기

  //   if (jwtToken) {
  //     const decodedToken = jwtDecode.decode(jwtToken);
  //     setUsername(decodedToken.username);
  //     setUserRole(decodedToken.role);
  //   }
  // }, []);

  // const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    // 현재 클릭된 메뉴의 이름을 저장.
    setCurrentMenu(event.currentTarget.id);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Wrapper>
      <Nav>
        <Logo>
          <Link href="/">
            <Image
              src="/redDice1Remove.png"
              alt="레드 다이스"
              width="40"
              height="40"
            />
          </Link>
          <Typography
            variant="h6"
            component={Link}
            href="/"
            sx={{
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            RED DICE
          </Typography>
        </Logo>
        {PAGES.map((page, idx) => (
          <>
            <Button
              sx={{
                color: "#262626",
                fontSize: "20px",
                fontWeight: 700,
              }}
              id={page.name}
              aria-controls={
                open && currentMenu === page.name
                  ? `${page.name}-menu`
                  : undefined
              }
              aria-haspopup="true"
              aria-expanded={
                open && currentMenu === page.name ? "true" : undefined
              }
              onClick={handleClick}
            >
              {page.name}
            </Button>
            <div>
              <Menu
                id={`${page.name}-menu`}
                anchorEl={anchorEl}
                open={open && currentMenu === page.name}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": page.name,
                }}
              >
                {page.children.map((cPage, cIdx) => (
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      router.push(cPage.url);
                    }}
                    key={`menu-item-${idx}-${cIdx}`}
                  >
                    {cPage.name}
                  </MenuItem>
                ))}
              </Menu>
            </div>
          </>
        ))}
      </Nav>

      {/* {userData && userData.name ? ( */}
      {userData ? (
        <>
          {/* <div>{userData.name}님</div> */}
          <IconButton
            onClick={(event) => {
              setAnchorEl(event.currentTarget);
              setCurrentMenu("account");
            }}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={
              open && currentMenu === "account" ? "account-menu" : undefined
            }
            aria-haspopup="true"
            aria-expanded={
              open && currentMenu === "account" ? "true" : undefined
            }
          >
            <div>{userData}님</div>
            <Avatar sx={{ m: 2, width: 32, height: 32 }}>
              {/* <AccountCircleRounded /> */}
            </Avatar>
          </IconButton>
          <Menu
            id="account-menu"
            anchorEl={anchorEl}
            open={open && currentMenu === "account"}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            {USERS.filter((user) => user.roles.includes(userRole)) // 현재 로그인한 사용자의 역할과 일치하는 메뉴 항목만 필터링
              .map((user, idx) => (
                <MenuItem
                  onClick={() => {
                    handleClose();
                    // router.push(user.url);
                    window.location.href = user.url;
                  }}
                  key={`user-menu-item-${idx}`}
                >
                  {user.name}
                </MenuItem>
              ))}
            <MenuItem onClick={onClickLogout}>로그아웃</MenuItem>
          </Menu>
        </>
      ) : (
        <Link href="/login" style={{ textDecoration: "none" }}>
          로그인
        </Link>
      )}
    </Wrapper>
  );
}
