/*!
 * jQuery Page Zoom Plugin v1.1
 *
 * Description:
 * Allow the user to zoom in or out on the page using links or buttons (anything that will accept an onClick event).
 *
 */
!function(o){o.page_zoom=function(e){var m={max_zoom:1.5,min_zoom:.5,zoom_increment:.1,current_zoom:1,selectors:{zoom_in:".zoom_in",zoom_out:".zoom_out",zoom_reset:".zoom_reset"}},t=!1,n={init:function(e){"object"==o.type(e)&&(m=o.extend(m,e)),"undefined"!=typeof Cookies&&(t=!0),t&&null==Cookies.get("page_zoom")?Cookies.set("page_zoom",1):(t?m.current_zoom=parseFloat(Cookies.get("page_zoom")):m.current_zoom=1,1!=m.current_zoom&&n.set_zoom(m.current_zoom)),o(m.selectors.zoom_in).bind("click",n.zoom_in),o(m.selectors.zoom_out).bind("click",n.zoom_out),o(m.selectors.zoom_reset).bind("click",n.zoom_reset)},set_zoom:function(e){o("div.conts").css({zoom:e,"-moz-transform":"scale("+e+")","-moz-transform-origin":"0 0"}),m.current_zoom=e,t&&Cookies.set("page_zoom",e)},zoom_in:function(){var o=parseFloat(m.current_zoom+m.zoom_increment);o<m.max_zoom?n.set_zoom(o):n.set_zoom(m.max_zoom)},zoom_out:function(){var o=parseFloat(m.current_zoom-m.zoom_increment);o>m.min_zoom?n.set_zoom(o):n.set_zoom(m.min_zoom)},zoom_reset:function(){n.set_zoom(1)}};n.init(e)}}(jQuery);
