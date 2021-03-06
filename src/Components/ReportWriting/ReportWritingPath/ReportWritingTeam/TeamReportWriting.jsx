import React, { useState, useEffect } from "react";
import TeamSubmitReportModal from "../../Modal/SubmitRequest/TeamReportRequest/TeamSubmitReportModal";
import ReportWritingModal from "../../Modal/ReportWritingModal";
import SelectedUsers from "../../Modal/SelectedUsers";
import LoadingPage from "../../LoadingPage";
import * as S from "../../../styled/ReportWriting/ReportWritingPath/ReportWritingTeam/style";
import { link } from "../../../../assets";
import { github as gitgubimg } from "../../../../assets";
import { useHistory } from "react-router-dom";
import { request, fileRequest, MainURL } from "../../../../utils/axios/axios";
import axios from "axios";

const TeamReportWriting = (props) => {
  const [state, setState] = useState("hidden");
  const [hei, setHei] = useState("0");
  const [myopa, setMyOpa] = useState("1");
  const [open, setOpen] = useState("hidden");
  const [myHei, setMyHei] = useState("0");
  const [tags, setTags] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [github, setGithub] = useState(
    "http://github.com" || "https://github.com"
  );
  const [fileId, setFileId] = useState("");
  const [teamName, setTeamName] = useState("");
  const [searchList, setSearchList] = useState([]);
  const [selectedUserList, setSelectedUserList] = useState([]);
  const [loading, setLoading] = useState(true);

  const history = useHistory();
  const ACCESS_TOKEN = localStorage.getItem("access-token");

  let clickCount = 0;

  const reportId = props.reportId;

  useEffect(() => {
    if (reportId) {
      async function getUserReportDatas() {
        try {
          const reportMainData = await request(
            "get",
            `/report/modify/${reportId}`,
            {
              Authorization: `Bearer ${ACCESS_TOKEN}`,
            }
          );
          setTitle(reportMainData.data.title);
          setTags(reportMainData.data.languages.map((lang) => lang));
          setDescription(reportMainData.data.description);
          setGithub(reportMainData.data.github);
          setTeamName(reportMainData.data.teamName);
          setSelectedUserList(
            reportMainData.data.member.map((user, index) => ({
              id: index + 1,
              name: user.memberName,
              email: user.memberEmail,
            }))
          );
          setFileId(reportMainData.data.fileId);

          const reportFileData = await fileRequest(
            "get",
            `/report/files/${reportId}`,
            {
              Authorization: `Bearer ${ACCESS_TOKEN}`,
            }
          );
          props.setFiles(
            reportFileData.data.map((file, index) => ({
              id: index + 1,
              name: file.path,
            }))
          );
        } catch (error) {
          switch (error.response.status) {
            case 403:
              alert("로그아웃");

              localStorage.removeItem("access-token");
              localStorage.removeItem("refresh-token");
              history.push("/");
              break;
            case 404:
              alert(error.response.status);
              break;
            default:
              break;
          }
        }
      }
      getUserReportDatas();
    }
  }, [ACCESS_TOKEN]);

  useEffect(() => {
    setInterval(() => {
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("teamUserTextData")) || {
      title: "",
      tags: [],
      description: "",
    };
    setTitle(savedData.title);
    setTags(savedData.tags);
    setDescription(savedData.description);
  }, [setTitle, setTags, setDescription]);

  if (loading) return <LoadingPage />;

  const onTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const onDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const onGithubChange = (e) => {
    setGithub(e.target.value);
  };

  const onTeamNameChange = (e) => {
    setTeamName(e.target.value);
  };

  const onShowUpMenu = () => {
    setState("visible");
    setHei("280px");
    setMyOpa("1");
  };

  const teamBtnClick = () => {
    setOpen("visible");
    setMyHei("450px");
  };

  const onLanguageChange = (elements) => {
    if (elements.key === "Enter" && elements.target.value.trim()) {
      const newTags = [...tags];
      newTags[tags.length] = elements.target.value;
      setTags(newTags);
      elements.target.value = "";
    }
    if (tags.length > 7) {
      alert("언어는 최대 8개까지 추가할 수 있습니다.");

      const overLimitTag = [...tags];
      overLimitTag.splice(elements, 0);
      setTags(overLimitTag);
    }
  };

  const onLanguageClick = (index) => {
    const delTags = [...tags];
    delTags.splice(index, 1);
    setTags(delTags);
  };

  const onClickFile = () => {
    const inputElement = document.createElement("input");
    inputElement.setAttribute("type", "file");
    inputElement.setAttribute("accept", ".pdf, .hwp");
    inputElement.click();
    inputElement.onchange = () => {
      const prevFiles = [...props.files];
      for (const file of inputElement.files) {
        prevFiles.push(file);
      }
      console.log(inputElement.files);
      props.setFiles(prevFiles);
      console.log(inputElement.value, inputElement.files[0].name);
    };
  };

  const onDelClickFile = (index) => {
    const delFile = [...props.files];
    delFile.splice(index, 1);
    props.setFiles(delFile);
  };

  const attachFiles = (index) => {
    if (props.files.length !== 0 && props.files.length < 2) {
      return props.files.map((fileData, i) => {
        return (
          <div key={i} onClick={() => onDelClickFile(i)}>
            {fileData.name}
          </div>
        );
      });
    } else if (props.files.length > 1) {
      alert("파일은 하나만 추가할 수 있습니다.");
      props.files.splice(index, 1);
      return false;
    }
    return <span>자신이 작성한 개발 보고서의 파일을 올려주세요.</span>;
  };

  const deleteSavedTextData = () => {
    setTimeout(() => {
      window.localStorage.removeItem("teamUserTextData");
    }, 172800000);

    clearTimeout(deleteSavedTextData);
  };

  let id;

  const isSaveData = () => {
    if (clickCount === 0) {
      axios
        .post(
          `${MainURL}/report/team`,
          {
            title: `${title}`,
            description: `${description}`,
            languages: tags,
            type: `${props.type}`,
            access: `${props.access}`,
            field: `${props.field}`,
            grade: `${props.grade}`,
            isSubmitted: true,
            fileName: `${props.files[0].name}`,
            github: `${github}`,
            teamName: `${teamName}`,
            members: selectedUserList.map((users) => {
              return users.email;
            }),
          },
          {
            headers: {
              "Contect-Type": "application/json",
              Authorization: `Bearer ${ACCESS_TOKEN}`,
            },
          }
        )
        .then((response) => {
          ++clickCount;

          id = response.data;
        })
        .catch((err) => {
          console.log("임시저장 실패");

          if (err.response.status === 400)
            alert("필수 입력칸을 모두 입력 후 임시저장 해주세요.");
        });
    } else {
      axios
        .post(
          `${MainURL}/report/team/${id}`,
          {
            title: `${title}`,
            description: `${description}`,
            languages: tags,
            type: `${props.type}`,
            access: `${props.access}`,
            field: `${props.field}`,
            grade: `${props.grade}`,
            isSubmitted: false,
            fileName: `${props.files[0].name}`,
            github: `${github}`,
            teamName: `${teamName}`,
            members: selectedUserList.map((users) => {
              return users.email;
            }),
          },
          {
            headers: {
              "Contect-Type": "application/json",
              Authorization: `Bearer ${ACCESS_TOKEN}`,
            },
          }
        )
        .then(() => {
          console.log("임시저장 성공");
        })
        .catch((err) => {
          console.log("임시저장 실패");

          if (err.response.status === 400)
            alert("필수 입력칸을 모두 입력 후 임시저장 해주세요.");
        });
    }

    window.localStorage.setItem(
      "teamUserTextData",
      JSON.stringify({
        title: title,
        tags: tags,
        description: description,
      })
    );

    deleteSavedTextData();
  };

  return (
    <>
      <TeamSubmitReportModal
        setState={setState}
        setHei={setHei}
        setMyOpa={setMyOpa}
        state={state}
        hei={hei}
        myopa={myopa}
        title={title}
        description={description}
        tags={tags}
        access={props.access}
        type={props.type}
        field={props.field}
        grade={props.grade}
        files={props.files}
        github={github}
        teamName={teamName}
        selectedUserList={selectedUserList}
        reportId={reportId}
        fileId={fileId}
      />
      <ReportWritingModal
        setOpen={setOpen}
        setMyHei={setMyHei}
        open={open}
        myHei={myHei}
        searchList={searchList}
        setSearchList={setSearchList}
        selectedUserList={selectedUserList}
        setSelectedUserList={setSelectedUserList}
      />

      <S.ReportBody>
        <S.ReportMain>
          <S.ReportTitle>
            <input
              type="text"
              placeholder="개발 보고서의 제목을 입력해주세요"
              onChange={onTitleChange}
              value={title}
            />
          </S.ReportTitle>
          <S.UseLang>
            {tags.map((tag, i) => {
              return (
                <S.Tag onClick={() => onLanguageClick(i)} index={i} key={i}>
                  {tag}
                </S.Tag>
              );
            })}
            <input
              type="text"
              placeholder="개발에 사용한 언어들을 입력해주세요"
              maxLength="7"
              onKeyPress={onLanguageChange}
            />
          </S.UseLang>
          <S.ReprotWriteBox>
            <textarea
              name="writingbox"
              rows="15"
              cols="40"
              minLength="10"
              placeholder="팀에서 작성한 개발보고서에 대한 소개글을 입력해주세요"
              onChange={onDescriptionChange}
              style={{ resize: "none" }}
              value={description}
            ></textarea>
          </S.ReprotWriteBox>
          <S.LinkBox>
            <span>
              <div>
                <img src={gitgubimg} alt="gitgub-link" />
                <input
                  type="text"
                  name="userGithubURL"
                  placeholder="(선택) 자신의 GITHUB 링크를 입력해주세요 ex) https://www.google.co.kr/"
                  onChange={onGithubChange}
                  value={github}
                />
              </div>
            </span>
          </S.LinkBox>
          <S.AttachFile>
            <S.inAttachFile>
              <img src={link} alt="attachfile" onClick={onClickFile} />
              {attachFiles()}
            </S.inAttachFile>
          </S.AttachFile>
        </S.ReportMain>
        <S.SubmitBox>
          <S.MakeTeam>
            <span>
              <S.SetTeamName>
                <S.TeamNameBox>
                  <S.InputTeamName
                    type="text"
                    placeholder="팀의 이름을 입력해주세요"
                    onChange={onTeamNameChange}
                    value={teamName}
                  />
                </S.TeamNameBox>
              </S.SetTeamName>
              <S.MtBtnBox>
                <S.MemberResult>
                  <S.ResultHeader>TEAM MEMBER</S.ResultHeader>
                  <S.ResultBody>
                    {selectedUserList.map((selectedUser) => {
                      return (
                        <SelectedUsers
                          key={selectedUser.id}
                          selectedUser={selectedUser}
                          reportId={reportId}
                        />
                      );
                    })}
                  </S.ResultBody>
                </S.MemberResult>
                <S.MtFlexBox>
                  <S.MtBtn onClick={teamBtnClick}>팀 만들기</S.MtBtn>
                </S.MtFlexBox>
              </S.MtBtnBox>
            </span>
          </S.MakeTeam>
          <S.SaveSubBtn>
            <S.SaveBtn>
              <div onClick={isSaveData}>임시저장</div>
            </S.SaveBtn>
            <S.SubBtn onClick={onShowUpMenu}>
              <div>제출하기</div>
            </S.SubBtn>
          </S.SaveSubBtn>
        </S.SubmitBox>
      </S.ReportBody>
    </>
  );
};
export default TeamReportWriting;
