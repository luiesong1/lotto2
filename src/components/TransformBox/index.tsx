import React from 'react';
import { Container } from './style';

interface Props {
  children: React.ReactNode;
  flexDirection?: 'row' | 'column';
  width?: string;
  height?: string;
  justifyContent?:
    | 'flex-end'
    | 'flex-start'
    | 'center'
    | 'space-around'
    | 'space-between';
  alignItems?: 'flex-end' | 'flex-start' | 'center' | 'space-around';
  paddingLeft?: number;
  paddingRight?: number;
  marginTop?: string;
  marginBottom?: string;
  position?: string;
  marginLeft?: string;
}
function TransformBox({
  children,
  flexDirection,
  width,
  height,
  justifyContent,
  alignItems,
  paddingLeft,
  paddingRight,
  marginBottom,
  marginTop,
  position,
  marginLeft,
}: Props) {
  return (
    <Container
      flexDirection={flexDirection}
      width={width}
      height={height}
      justifyContent={justifyContent}
      alignItems={alignItems}
      paddingLeft={paddingLeft}
      paddingRight={paddingRight}
      marginTop={marginTop}
      marginBottom={marginBottom}
      position={position}
      marginLeft={marginLeft}
    >
      {children}
    </Container>
  );
}

export default TransformBox;
