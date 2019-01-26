<?php 
if ( ! defined( 'ABSPATH' ) ) exit; 
/* One Line Walker */
class One_Line_Walker extends Walker{
	
    public function walk( $elements, $max_depth ){
        $list = array ();

        foreach ( $elements as $item ){
			
			$list[] = '<a href="' . $item->url . '" class="w-nav-link nav-link" >' . $item->title . '</a>' . "\n";
			
        }
		
        return join( "\n", $list );
    }
	
} 

?>