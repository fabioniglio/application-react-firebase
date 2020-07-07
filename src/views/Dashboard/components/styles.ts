import styled from 'styled-components';

import { shade } from 'polished';

export const Container = styled.div``;

export const Header = styled.div`
  padding: 32px;
  background: #28262e;
`;

export const HeaderContent = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  display: flex;
  align-items: center;

  button {
    margin-left: auto;
    background: transparent;
    border: 0;

    svg {
      color: #999591;
      width: 20px;
      height: 20px;
    }
  }
`;

export const Content = styled.main`
  max-width: 1120px;
  margin: 64px auto;
  display: flex;
  align-items: center;
  justify-content: center;

  a {
    color: #6b6b6b;
    display: block;

    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: ${shade(0.4, '#28262e')};
    }
  }
`;
