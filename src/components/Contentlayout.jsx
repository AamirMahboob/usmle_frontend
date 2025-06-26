"use client";

import { Layout, Input } from "antd";
const { Content } = Layout;
import { Typography, Spin } from "antd";
const { Title } = Typography;

import React, { Suspense, useEffect } from "react";

export default function LayoutContentComponent({ title, ContentSection }) {
  if (!title) {
    title = "Dashboard";
  }

  return (
    <>
      <Content className="pt-6 px-6 !bg-custom-body-color   text-gray-900  ">
        <div>
          <Suspense fallback={<Spin size="large" />}>
            <div
              className={` ${
                title === "Report"
                  ? "bg-[#0B1739] border-[#343B4F] rounded-[20px] text-[#AEB9E1]"
                  : "bg-custom-body-color "
              }`}
            >
              {/* <div className="flex justify-between">
                                <Title className="!text-black ms-2" level={4}>
                                    {title}
                                </Title>

                            </div> */}
              <ContentSection />
            </div>
          </Suspense>
        </div>
      </Content>
    </>
  );
}
