import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import SoleReportWriting from "./ReportWritingPath/ReportWritingSole/SoleReportWriting";
import TeamReportWriting from "./ReportWritingPath/ReportWritingTeam/TeamReportWriting";
import CircleReportWriting from "./ReportWritingPath/ReportWritingCircle/CircleReportWriting";
import Header from "../Main/Header";
import * as S from "../styled/ReportWriting/style";
import { RWlogo } from "../../assets";
import { select } from "../../assets";
import { selecthover } from "../../assets";
import { request } from "../../utils/axios/axios";

const ReportWriting = ({ files, setFiles }) => {
  const [grade, setGrade] = useState("");
  const [type, setType] = useState("");
  const [field, setField] = useState("");
  const [access, setAccess] = useState("");
  const [hoverNumber, setHoverNumber] = useState(0);
  const [clickTypeNumber, setClickTypeNumber] = useState("구분 선택");
  const [clickGradeNumber, setClickGradeNumber] = useState("학년 선택");
  const [clickFieldNumber, setClickFieldNumber] = useState("개발 분야");
  const [clickAcceessNumber, setClickAcceessNumber] = useState("공개 범위");
  const [showSoleReportComponent, setShowSoleReportComponent] = useState(false);
  const [showTeamReportComponent, setShowTeamReportComponent] = useState(false);
  const [showCircleReportComponent, setShowCircleReportComponent] =
    useState(false);

  const ACCESS_TOKEN = localStorage.getItem("access-token");
  const REFRESH_TOKEN = localStorage.getItem("refresh-token");
  const history = useHistory();
  const location = useLocation();

  const reportId = location.state ? location.state.reportId : undefined;

  useEffect(() => {
    if (!ACCESS_TOKEN || !REFRESH_TOKEN) {
      alert("로그인 후 이용해주세요.");
      history.push("/");
    }
  }, [ACCESS_TOKEN, REFRESH_TOKEN, history]);

  useEffect(() => {
    if (reportId) {
      async function getUserReportHeaderData() {
        try {
          const reportHeaderData = await request(
            "get",
            `/report/modify/${reportId}`,
            {
              Authorization: `Bearer ${ACCESS_TOKEN}`,
            }
          );
          setType(reportHeaderData.data.type);
          setGrade(reportHeaderData.data.grade);
          setField(reportHeaderData.data.field);
          setAccess(reportHeaderData.data.access);
        } catch (error) {
          switch (error.response.status) {
            case 403:
              alert("로그아웃 됩니다.");

              localStorage.removeItem("access-token");
              localStorage.removeItem("refresh-token");
              history.push("/");
              break;
            default:
              break;
          }
        }
      }
      getUserReportHeaderData();
    }
  }, [ACCESS_TOKEN]);

  const onMouseOver = (e) => {
    setHoverNumber(Number(e.currentTarget.dataset.id));
  };

  const onMouseLeave = () => {
    setHoverNumber(0);
  };

  const isTypeClick = (props) => {
    switch (props.target.dataset.type) {
      case "type":
        setClickTypeNumber(props.target.innerHTML);
        setType(props.target.dataset.id);

        switch (props.target.dataset.id) {
          case "SOLE":
            setShowSoleReportComponent(true);
            setShowTeamReportComponent(false);
            setShowCircleReportComponent(false);
            break;
          case "TEAM":
            setShowTeamReportComponent(true);
            setShowSoleReportComponent(false);
            setShowCircleReportComponent(false);
            break;
          case "CIRCLES":
            setShowCircleReportComponent(true);
            setShowSoleReportComponent(false);
            setShowTeamReportComponent(false);
            break;
          default:
            console.log("err");
        }
        break;
      case "grade":
        setClickGradeNumber(props.target.innerHTML);
        setGrade(props.target.dataset.id);
        break;
      case "field":
        setClickFieldNumber(props.target.innerHTML);
        setField(props.target.dataset.id);
        break;
      case "access":
        setClickAcceessNumber(props.target.innerHTML);
        setAccess(props.target.dataset.id);
        break;
      default:
        console.log("err");
    }
  };

  return (
    <>
      <Header />
      <S.Main>
        <S.BorderBox>
          <S.InlineBox>
            <S.ReportHeader>
              <S.ReportLogo>
                <span>
                  <img src={RWlogo} alt="Rwlogo" />
                </span>
              </S.ReportLogo>
              <S.SelectBoxs>
                <S.PaddingBox>
                  <S.Select
                    data-id="1"
                    onMouseOver={onMouseOver}
                    onMouseLeave={onMouseLeave}
                  >
                    {hoverNumber === 1 ? (
                      <S.SelctFlexBox>
                        <span>{clickTypeNumber}</span>
                        <img
                          src={selecthover}
                          style={{ width: "11px" }}
                          alt="grade"
                        />
                      </S.SelctFlexBox>
                    ) : (
                      <S.SelctFlexBox>
                        <span>{clickTypeNumber}</span>
                        <img src={select} alt="grade" />
                      </S.SelctFlexBox>
                    )}
                    <S.ViewList>
                      <S.ListTable
                        data-id="SOLE"
                        data-type="type"
                        onClick={isTypeClick}
                      >
                        개인
                      </S.ListTable>
                      <S.ListTable
                        data-id="TEAM"
                        data-type="type"
                        onClick={isTypeClick}
                      >
                        팀
                      </S.ListTable>
                      <S.ListTable
                        data-id="CIRCLES"
                        data-type="type"
                        onClick={isTypeClick}
                      >
                        동아리
                      </S.ListTable>
                    </S.ViewList>
                  </S.Select>
                  <S.Select
                    data-id="2"
                    onMouseOver={onMouseOver}
                    onMouseLeave={onMouseLeave}
                  >
                    {hoverNumber === 2 ? (
                      <S.SelctFlexBox>
                        <span>{clickGradeNumber}</span>
                        <img
                          src={selecthover}
                          style={{ width: "11px" }}
                          alt="type"
                        />
                      </S.SelctFlexBox>
                    ) : (
                      <S.SelctFlexBox>
                        <span>{clickGradeNumber}</span>
                        <img src={select} alt="type" />
                      </S.SelctFlexBox>
                    )}
                    <S.ViewList>
                      <S.ListTable
                        data-id="GRADE1"
                        data-type="grade"
                        onClick={isTypeClick}
                      >
                        1학년
                      </S.ListTable>
                      <S.ListTable
                        data-id="GRADE2"
                        data-type="grade"
                        onClick={isTypeClick}
                      >
                        2학년
                      </S.ListTable>
                      <S.ListTable
                        data-id="GRADE3"
                        data-type="grade"
                        onClick={isTypeClick}
                      >
                        3학년
                      </S.ListTable>
                    </S.ViewList>
                  </S.Select>
                  <S.Select
                    data-id="3"
                    onMouseOver={onMouseOver}
                    onMouseLeave={onMouseLeave}
                    height={165}
                  >
                    {hoverNumber === 3 ? (
                      <S.SelctFlexBox>
                        <span>{clickFieldNumber}</span>
                        <img
                          src={selecthover}
                          style={{ width: "11px" }}
                          alt="field"
                        />
                      </S.SelctFlexBox>
                    ) : (
                      <S.SelctFlexBox>
                        <span>{clickFieldNumber}</span>
                        <img src={select} alt="field" />
                      </S.SelctFlexBox>
                    )}
                    <S.ViewList>
                      <S.ListTable
                        data-id="WEB"
                        data-type="field"
                        onClick={isTypeClick}
                      >
                        웹
                      </S.ListTable>
                      <S.ListTable
                        data-id="APP"
                        data-type="field"
                        onClick={isTypeClick}
                      >
                        앱
                      </S.ListTable>
                      <S.ListTable
                        data-id="GAME"
                        data-type="field"
                        onClick={isTypeClick}
                      >
                        게임
                      </S.ListTable>
                      <S.ListTable
                        data-id="AI"
                        data-type="field"
                        onClick={isTypeClick}
                      >
                        인공지능
                      </S.ListTable>
                      <S.ListTable
                        data-id="EMBEDDED"
                        data-type="field"
                        onClick={isTypeClick}
                      >
                        임베디드
                      </S.ListTable>
                      <S.ListTable
                        data-id="SECURITY"
                        data-type="field"
                        onClick={isTypeClick}
                      >
                        정보보안
                      </S.ListTable>
                      <S.ListTable
                        data-id="FUSION"
                        data-type="field"
                        onClick={isTypeClick}
                      >
                        융합
                      </S.ListTable>
                    </S.ViewList>
                  </S.Select>
                  <S.Select
                    data-id="4"
                    onMouseOver={onMouseOver}
                    onMouseLeave={onMouseLeave}
                    height={52}
                  >
                    {hoverNumber === 4 ? (
                      <S.SelctFlexBox>
                        <span>{clickAcceessNumber}</span>
                        <img
                          src={selecthover}
                          style={{ width: "11px" }}
                          alt="access"
                        />
                      </S.SelctFlexBox>
                    ) : (
                      <S.SelctFlexBox>
                        <span>{clickAcceessNumber}</span>
                        <img src={select} alt="access" />
                      </S.SelctFlexBox>
                    )}
                    <S.ViewList>
                      <S.ListTable
                        data-id="EVERY"
                        data-type="access"
                        onClick={isTypeClick}
                      >
                        전체 공개
                      </S.ListTable>
                      <S.ListTable
                        data-id="ADMIN"
                        data-type="access"
                        onClick={isTypeClick}
                      >
                        비공개
                      </S.ListTable>
                    </S.ViewList>
                  </S.Select>
                </S.PaddingBox>
              </S.SelectBoxs>
            </S.ReportHeader>
            <S.ReportBody>
              {showSoleReportComponent === true ? (
                <SoleReportWriting
                  reportId={reportId}
                  type={type}
                  grade={grade}
                  field={field}
                  access={access}
                  files={files}
                  setFiles={setFiles}
                />
              ) : null || showTeamReportComponent === true ? (
                <TeamReportWriting
                  reportId={reportId}
                  type={type}
                  grade={grade}
                  field={field}
                  access={access}
                  files={files}
                  setFiles={setFiles}
                />
              ) : null || showCircleReportComponent === true ? (
                <CircleReportWriting
                  reportId={reportId}
                  type={type}
                  grade={grade}
                  field={field}
                  access={access}
                  files={files}
                  setFiles={setFiles}
                />
              ) : null}
            </S.ReportBody>
          </S.InlineBox>
        </S.BorderBox>
      </S.Main>
    </>
  );
};

export default ReportWriting;
