import styled from "styled-components";

export const App = styled.div`
  width: 100%;
  height: 100vh;
  background: ${(props) => props.theme.layout.bg};
  position: relative;

  &::before {
    width: 100%;
    /* height: 120px; */
    top: 0;
    left: 0;
    position: absolute;
    content: "";
    z-index: 1;
  }
`;

export const Message = styled.p`
  display: none;

  @media screen and (max-width: 500px) {
    padding-top: 200px;
    text-align: center;
    font-size: 1.2rem;
    display: block;
  }
`;

export const Content = styled.div`
  width: 100%;
  height: 100vh;
  margin: 0;
  box-shadow: ${(props) => props.theme.layout.contentBoxShadowColor};
  position: relative;
  z-index: 100;
  display: flex;
  overflow: hidden;
`;
