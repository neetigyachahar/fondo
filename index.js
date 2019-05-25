function togglenav(){
    var mysheet=document.styleSheets[0];
    var myrules=mysheet.cssRules? mysheet.cssRules: mysheet.rules;
    myrules = myrules[11].cssRules;

    for (i=0; i<myrules.length; i++){
    if(myrules[i].selectorText=="#navlist"){ //find "a:hover" rule
    visibilitycheck=myrules[i];
    break;
    }
    }

    if(visibilitycheck.style.visibility == "hidden")
        visibilitycheck.style.visibility = 'visible';
    else
        visibilitycheck.style.visibility = 'hidden';


    for (i=0; i<myrules.length; i++){
        if(myrules[i].selectorText=="#navlist li"){ //find "a:hover" rule
        heightcheck=myrules[i]; 
        break;
        }
        }

if(heightcheck.style.height == "0px")
    heightcheck.style.height = 'auto';
else
    heightcheck.style.height = '0px';
}