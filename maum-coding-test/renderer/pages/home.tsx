import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";

import Input from "../components/shared/input";
import Button from "../components/shared/button";

function Home() {
  return (
    <React.Fragment>
      <Link href="/signin">Sign In</Link>
      <Link href="/signup">Sign Up</Link>
    </React.Fragment>
  );
}

export default Home;
