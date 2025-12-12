import styled from 'styled-components';

export const Container = styled.div<{
  flexDirection?: string;
  width?: string;
  height?: string;
  justifyContent?: string;
  alignItems?: string;
  paddingLeft?: number;
  paddingRight?: number;
  marginTop?: string;
  marginBottom?: string;
  position?: string;
  marginLeft?: string;
}>`
  display: flex;
  flex-direction: ${({ flexDirection }) => flexDirection};
  width: ${({ width }) => (width ? width : 'auto')};
  height: ${({ height }) => (height ? height : 'auto')};
  justify-content: ${({ justifyContent }) =>
    justifyContent ? justifyContent : 'flex-start'};
  align-items: ${({ alignItems }) => (alignItems ? alignItems : 'stretch')};
  padding-left: ${({ paddingLeft }) => (paddingLeft ? `${paddingLeft}px` : 0)};
  padding-right: ${({ paddingRight }) =>
    paddingRight ? `${paddingRight}px` : 0};
  margin-top: ${({ marginTop }) => (marginTop ? marginTop : 0)};
  margin-bottom: ${({ marginBottom }) => (marginBottom ? marginBottom : 0)};
  margin-left: ${({ marginLeft }) => (marginLeft ? marginLeft : 0)};
  position: ${({ position }) => position};
`;
