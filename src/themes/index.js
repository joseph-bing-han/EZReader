import defaultThemes from '@ant-design/react-native/lib/style/themes/default';

// colors  #97dbad  #c3e5ad  #edd987	#f1e1a5  	#f4bbbc
const brandPrimary = '#ff6000';
const brandPrimaryTap = `${brandPrimary}99`;
export default {
  ...defaultThemes,
  color_link: brandPrimary,
  brand_wait: brandPrimary,
  brand_primary: brandPrimary,
  brand_primary_tap: brandPrimaryTap,
  primary_button_fill: brandPrimary,
  ghost_button_color: brandPrimary,
  ghost_button_fill_tap: brandPrimaryTap,
  input_color_icon_tap: brandPrimary,
  tabs_color: brandPrimary,
  segmented_control_color: brandPrimary,
  segmented_control_fill_tap: `${brandPrimary}10`,
  color_dark_green: '#97dbad',
  color_light_green: '#c3e5ad',
  color_dark_yellow: '#edd987',
  color_light_yellow: '#f1e1a5',
  color_pink: '#f4bbbc',
  color_font_primary: '#ff6000',
};
