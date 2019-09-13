#### 0.5
* __Bugfix__ The website settings registration were missing

#### 0.4
* __Added__ Site custom Javascript
* __Added__ Site custom CSS
* __Added__ WordPress logs rotation
* __Added__ Delete WordPress logs older than 90 days
* __Added__ Page template - Full Width
* __Added__ fancyBox v3.5.6 integration
* __Added__ nx_thumb - 16:9 ratio thumb file (500x312px size)
* __Added__ Custom image sizes to gallery shortcode
* __Added__ 3rd level menu support - No CSS / Javascript as this is design dependent
* __Added__ `nx_page_title()` - Custom page title + subtitle
* __Added__ Widget - Accordion
* __Added__ Widget - Lightbox image
* __Added__ Widget - Image slider
* __Added__ Widget - Modal
* __Added__ SCSS - Typography
* __Updated__ Gruntfile.js - Full command for installing Grunt, in a single line
* __Updated__ `nx_get_site_config()` - Added __Social Networks__ repeater field
* __Changed__ Custom fields
* __Changed__ Playground - all admins can now access the playground
* __Changed__ Bootstrap navwalker - removed title attribute from links
* __Bugfix__ Playground - moved `get_header()` after user checking
* __Bugfix__ Fatal error: Uncaught Error: Call to undefined function nexus_pagination() in search.php:25
* __Bugfix__ Pagination - the pagination was displaying `$page` instead of HTML list element
* __Bugfix__ CSS - Disable horizontal overflow (scrolling)

#### 0.3
* __Added__ scripts.js - jQuery functionality in non-conflict mode
* __Added__ _custom.css - Please place here all the custom CSS
* __Added__ Template name - Playground - Here you can do all possible tests, without being worried about visitors seing the debug info
* __Changed__ Main menu - The menu should be displayed on the right side, by default
* __Updated__ Bootstrap Framework - v3.3.7 to v3.4.1
* __Updated__ Font Awesome - 4.6.3 to 4.7.0
* __Updated__ Gruntfile.js
* __Updated__ package.json
* __Removed__ animate.css
* __Removed__ nexus-admin translation strings - the admin will be displayed in English language only
* __Removed__ old php includes from functions.php

#### 0.2
* __Added__ `nx_dump()` function - Better `var_dump()` alternative
* __Added__ `nx_get_page_custom_fields()` function - Get the page information
* __Added__ `nx_get_site_config()` function - Get all website settings with a single database query and caching on
* __Bugfix__ `Fatal error: Uncaught ArgumentCountError: Too few arguments to function nx_pagination()`
* __Bugfix__ `Fatal error: Uncaught Error: Call to undefined function nexus_pagination() in archive.php:29`

#### 0.1
* Initial release