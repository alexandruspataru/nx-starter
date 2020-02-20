#### 0.8
* __Added__ Index file for each folders (preventing directory listing)
* __Added__ TinyMCE table support
* __Added__ SiteOrigin Page Builder - The newly created widgets are active by default (upon creation)
* __Changed__ Custom Fields
* __Changed__ Home - added custom title support
* __Removed__ Front Page support - We can use widgets / custom fields to achieve that
* __Removed__ core/admin folder - No longer needed

#### 0.7
* __Added__ SCSS - H1 subtitle
* __Changed__ Embed Shortcode - added responsive embed for YouTube / Vimeo videos
* __Changed__ Single Post - sidebar CSS / HTML formatting
* __Changed__ Widget - Lightbox image - Added Facebook videos support
* __Changed__ SCSS - completely new structure
* __Changed__ page-playground.php - added bootstrap wrapper
* __Changed__ page-playground.php - removed the sidebar
* __Changed__ page-playground.php - moved the debug under page title
* __Bugfix__ archive.php - the pagination wasn't included into grid
* __Bugfix__ search.php - the pagination wasn't included into grid

#### 0.6
* __Added__ SCSS - Password protected pages (form fixes)
* __Added__ SCSS - /parts/ folder - keeping all the partials here
* __Added__ Image - placeholder-thumb.png
* __Added__ Footer - Copyright section
* __Added__ Footer menu
* __Added__ Footer Sidebars - Up to 4 columns
* __Added__ Back to top button (again)
* __Changed__ Footer - The widget title is not H3 instead of H2
* __Changed__ parts/content-archive.php - added a more efficient (starter) design
* __Changed__ parts/content-archive.php - changed the css classes names + the way we get the post info (title / link / image)
* __Bugfix__ archive.php - added Bootstrap wrapper for archive title
* __Bugfix__ search.php - added Bootstrap wrapper for archive title
* __Bugfix__ search.php - the title is now H1
* __Bugfix__ search.php - removed the sidebar

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