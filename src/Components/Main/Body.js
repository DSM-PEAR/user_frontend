import React from 'react';
import * as S from '../styled/MainStyled/BodyStyle';
import Logo from '../../assets/PEARlogo.svg';

const Body = () => {

    const onclick = () => {
        window.scrollTo({top: 935, behavior: "smooth"});
    }

    return (
        <>

        <S.MainBody>
            <S.LogoBox>
                <S.LogoSubBox>
                    <S.Logo><img src={Logo} alt="사진"/></S.Logo>
                    <S.LogoText>
                        <span>P</span>reserve&nbsp;<span>E</span>xperience&nbsp;<span>A</span>bout your&nbsp;<span>R</span>eport
                    </S.LogoText>
                </S.LogoSubBox>
            </S.LogoBox>
            <S.NextBox>
                <div>
                <img src={Logo} alt="사진" onClick={onclick}/>
                </div>
            </S.NextBox>
        </S.MainBody>
            
        </>
    )


}

export default Body;

{/* <S.Logo src={Logo} />
            <S.LogoText>
                <p>P</p>reserve&nbsp;<p>E</p>xperience&nbsp;<p>A</p>bout your&nbsp;<p>R</p>eport
            </S.LogoText> */}