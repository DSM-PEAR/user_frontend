import React from "react";
import * as S from "../styled/ViewReport/style";
import ReportGrade from "./ReportGrade";
import Categorybar from './Categorybar';
import MainProject from './MainProject';

function ViewReport() {
  return (
    <S.Main>
      <S.Cover>
        <div className="coverCategory">
          <ReportGrade grade="1" />
          <Categorybar/>
        </div>
        <MainProject/>
      </S.Cover>
    </S.Main>
  );
}

export default ViewReport;