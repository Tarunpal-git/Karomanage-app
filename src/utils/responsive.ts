import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export const responsive = {
  // Width and height utilities
  wp,
  hp,
  
  // Common responsive padding values
  padding: {
    xs: wp('1%'),
    sm: wp('2%'),
    md: wp('4%'),
    lg: wp('6%'),
    xl: wp('8%'),
  },
  
  // Common responsive margin values
  margin: {
    xs: wp('1%'),
    sm: wp('2%'),
    md: wp('4%'),
    lg: wp('6%'),
    xl: wp('8%'),
  },
  
  // Common responsive font sizes
  fontSize: {
    xs: wp('3%'),
    sm: wp('3.5%'),
    md: wp('4%'),
    lg: wp('5%'),
    xl: wp('6%'),
    xxl: wp('7%'),
  },
  
  // Common responsive spacing values
  spacing: {
    xs: wp('1%'),
    sm: wp('2%'),
    md: wp('4%'),
    lg: wp('6%'),
    xl: wp('8%'),
  },
  
  // Common responsive border radius values
  borderRadius: {
    xs: wp('1%'),
    sm: wp('2%'),
    md: wp('3%'),
    lg: wp('4%'),
    xl: wp('6%'),
  },
  
  // Common responsive shadow values
  shadow: {
    xs: wp('0.25%'),
    sm: wp('0.5%'),
    md: wp('1%'),
    lg: wp('2%'),
    xl: wp('3%'),
  },
  
  // Screen dimensions
  screen: {
    width: wp('100%'),
    height: hp('100%'),
  },
  
  // Common responsive button sizes
  button: {
    small: {
      height: hp('5%'),
      paddingHorizontal: wp('3%'),
      paddingVertical: hp('1%'),
      borderRadius: wp('2%'),
    },
    medium: {
      height: hp('6%'),
      paddingHorizontal: wp('4%'),
      paddingVertical: hp('1.5%'),
      borderRadius: wp('3%'),
    },
    large: {
      height: hp('7%'),
      paddingHorizontal: wp('6%'),
      paddingVertical: hp('2%'),
      borderRadius: wp('4%'),
    },
  },
  
  // Common responsive input sizes
  input: {
    height: hp('6%'),
    paddingHorizontal: wp('4%'),
    borderRadius: wp('2.5%'),
  },
  
  // Common responsive card sizes
  card: {
    padding: wp('6%'),
    borderRadius: wp('4%'),
    marginHorizontal: wp('2%'),
  },
};

export default responsive;
