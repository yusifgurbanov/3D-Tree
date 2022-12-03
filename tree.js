/*
    CSCI 2408 Computer Graphics Fall 2022 
    (c)2022 by Yusif Gurbanov
    Submitted in partial fulfillment of the requirements of the course.

                                    REFERENCES:
https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Getting_started_with_WebGL 
https://stackoverflow.com/questions/65169862/html-download-attribute-for-obj-file 

*/
var canvas;
var context;
window.onload = init;

// All parameters
let ax; 
let az; 
let k1;
let m2;

let bx;
let bz;
let k2;
let m3;

let cx;
let cz;
let k3;
let l; // initial length L
let limit; // stop level
let file_name; 
 
let vertex = []; // list to store my vertices

function init() {
    // Get reference to the context of the canvas
    canvas = document.getElementById("gl-canvas");
    //context = canvas.getContext("2d");
    
}// end init()

// writing to OBJ file 
let objFileContent = `
`;
// download OBJ file = objFileContent
let generate = document.getElementById("generate");
generate.addEventListener("click", function(){
    let link = document.createElement('a');
    link.download = file_name + '.obj'; // ask user to enter file name
    let blob = new Blob([objFileContent], {
        type: 'application/object'
      });
      link.href = URL.createObjectURL(blob);
      document.body.appendChild(link);
      link.click();
})

// get parameters
// when click submit, all calculations happen
let submit_button = document.getElementById("submit");
submit_button.addEventListener("click", function(){

    ax = (parseFloat(document.getElementById('ax').value) * Math.PI) / 180; // degree to radian
    az = (parseFloat(document.getElementById('az').value) * Math.PI) / 180;
    k1 = parseFloat(document.getElementById('k1').value);                   
    m2 = parseFloat(document.getElementById('m2').value);                   

    bx = (parseFloat(document.getElementById('bx').value) * Math.PI) / 180;
    bz = (parseFloat(document.getElementById('bz').value) * Math.PI) / 180;
    k2 = parseFloat(document.getElementById('k2').value);
    m3 = parseFloat(document.getElementById('m3').value);

    cx = (parseFloat(document.getElementById('cx').value) * Math.PI) / 180;
    cz = (parseFloat(document.getElementById('cz').value) * Math.PI) / 180;
    k3 = parseFloat(document.getElementById('k3').value);
    l = parseFloat(document.getElementById('length').value); // initial length L
    limit = parseFloat(document.getElementById('limit').value); // stop level / limit
    file_name = document.getElementById('text').value;
    
    function getFirstPoint(x,y,z){
        return [x,y, z + m2 * l];
    }// end getFirstPoint
    
    function getSecondPoint(x,y,z){
        return [x,y, z + m3 * l];
    }// end getSecondPoint

    function getThirdPoint(x,y,z){
        return [x,y, z + l]; // there is no factor to define third point
    }// end getThirdPoint
    
    // translation -> rotateX -> rotateZ  
    function translationZ(x,y,z,coef){
        return [x,y, z + coef * l];
    }// end translationZ
    
    function rotateX(x,y,z,angle){
        return [x, y * Math.cos(angle) - z * Math.sin(angle), y * Math.sin(angle) + z * Math.cos(angle)]
    }// end rotateX

    function rotateZ(x,y,z, angle){
        return [x * Math.cos(angle) - y * Math.sin(angle), y * Math.cos(angle) + x * Math.sin(angle), z];
    }// end rotateZ
    
    // translation -> rotateX -> rotateZ
    /*
    translation : move my coordinate along z axis
    rotation : rotate around x axis and the rotate around z axis
    since i am getting translated and rotated coordinates, no need to apply parents' translations and rotations
    */

    vertex.push(0,0,0) // the origin of coordinate frame

    function branch1(x,y,z, limit){
        //x,y,z for getting coordinate of parent point
        let a1 = getFirstPoint(x,y,z);
        vertex.push(a1[0], a1[1], a1[2]); // push my first m * factored coordinate to the list
        while(limit > 0){
            
            let a2 = translationZ(a1[0], a1[1], a1[2], k1);
            let a3 = rotateX(a2[0], a2[1], a2[2], ax);
            let a4 = rotateZ(a3[0], a3[1], a3[2], az);
            vertex.push(a4[0], a4[1], a4[2]); // push translated and rotated coordinates to the list
            a1[0] = a4[0];
            a1[1] = a4[1];
            a1[2] = a4[2]; // transfer translayed and rotated coordinates to the top
            k1 = k1 * k1;
            limit = limit - 1;
        }// end while
    }//end branch1
    
    function branch2(x,y,z, limit){
        //x,y,z for getting coordinate of parent point
        let b1 = getSecondPoint(x,y,z);
        vertex.push(b1[0], b1[1], b1[2]); // push my first m * factored coordinate to the list
        while(limit > 0){
            
            let b2 = translationZ(b1[0], b1[1], b1[2], k2);
            let b3 = rotateX(b2[0], b2[1], b2[2], bx);
            let b4 = rotateZ(b3[0], b3[1], b3[2], bz);
            vertex.push(b4[0], b4[1], b4[2]); // push translated and rotated coordinates to the list
            b1[0] = b4[0];
            b1[1] = b4[1];
            b1[2] = b4[2]; // transfer translayed and rotated coordinates to the top
            k2 = k2 * k2;
            limit = limit - 1;
        }// end while
    }// end branch2

    function branch3(x,y,z, limit){
        //x,y,z for getting coordinate of parent point
        let c1 = getThirdPoint(x,y,z);
        vertex.push(c1[0], c1[1], c1[2]); // push my first m * factored coordinate to the list
        while(limit > 0){
            
            let c2 = translationZ(c1[0], c1[1], c1[2], k3);
            let c3 = rotateX(c2[0], c2[1], c2[2], cx);
            let c4 = rotateZ(c3[0], c3[1], c3[2], cz);
            vertex.push(c4[0], c4[1], c4[2]); // push translated and rotated coordinates to the list
            c1[0] = c4[0];
            c1[1] = c4[1];
            c1[2] = c4[2]; // transfer translayed and rotated coordinates to the top
            k3 = k3 * k3;
            limit = limit - 1;
        }// end while
    }// end branch3
    

        
    //---------------------- Branch 1 ---------------------------
    let sample1 = branch1(vertex[0], vertex[1], vertex[2], limit);

    // writing vertices of branch1 to the list
    for(let i=0; i<vertex.length;i+=3){
        objFileContent += 'v' + ' ' + vertex[i] + ' ' + vertex[i+1] + ' ' + vertex[i+2] + '\n';
    }
    let last; // detect what is the last number when drawing line
    for(let i=1; i<(vertex.length)/3; i++){
        objFileContent += 'f' + ' ' + i + ' ' + (i+1) +' ' + i + '\n';
        last = i+1; 
    }
    let last1 = vertex.length; // detect what is the length of branch1


    //---------------------- Branch 2 ---------------------------
    let sample2 = branch2(vertex[0], vertex[1], vertex[2], limit);

    // writing vertices of branch2 to the list
    for(let i=last1; i<vertex.length;i+=3){
        objFileContent += 'v' + ' ' + vertex[i] + ' ' + vertex[i+1] + ' ' + vertex[i+2] + '\n';
    }

    objFileContent += 'f' + ' ' + 1 + ' ' + (last+1) +' ' + 1 + '\n'; // draw a line from origin to the firt coordinate of branch2

    let last3; // detect what is the last number when drawing line
    for(let i=(last+1); i<(vertex.length)/3; i++){
        objFileContent += 'f' + ' ' + i + ' ' + (i+1) + ' ' + i +'\n';
        last3 = i + 1;
    } 
    let last2= vertex.length; // detect what is the length of branch2

    //---------------------- Branch 3 ---------------------------
    let sample3 = branch3(vertex[0], vertex[1], vertex[2], limit);

    // writing vertices of branch3 to the list
    for(let i=last2; i<vertex.length;i+=3){
        objFileContent += 'v' + ' ' + vertex[i] + ' ' + vertex[i+1] + ' ' + vertex[i+2] + '\n';
    }
    objFileContent += 'f' + ' ' + 1 + ' ' + (last3+1) + ' ' + 1 + '\n'; // draw a line from origin to the firt coordinate of branch3
    for(let i=(last3+1); i<(vertex.length)/3; i++){
        objFileContent += 'f' + ' ' + i + ' ' + (i+1) +' ' + i + '\n';
    }  
    // if you want to write with l, not f. Kindly ask you to change all 'f' to 'l' 
    //and delete third points (line 182, 196, 200, 212, 214 ) in objFileContent
    // and run it on https://www.creators3d.com/online-viewer 

    //console.log(objFileContent); // check whether obj file contains coordinates beforehand
})// addeventListener

let fileopen;
let model;
class Object{

}// end Object


// produces a tree in 2d
// since it is not developed fully, you have to type your inputs from the code manually
/*
function generate_tree(limit, length, x1,y1){ // produces main straight line of the tree
    var process = 3; // The process is repeated for each of the new 3 branches
    while(process>0){
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x1 + length * Math.cos(30), y1 + length * Math.sin(30));
        context.stroke();
        x1= x1 + length * Math.cos(30);
        y1= y1 + length * Math.sin(30);

        if(process==3) sub_branch3(0.5, 180,x1, y1);
        if(process==2) sub_branch2(0.4, 270,x1, y1);
        if(process==1) sub_branch1(0.5, 150,x1, y1);
        process=process -1;
    }// end while
    
    limit = limit -1;
    if(limit > 0) generate_tree(limit, length, x1,y1);
    
}// end generate_tree

function sub_branch3(k3, angle3, x1,y1){
    var limit3 = limit;
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x1 + k3 * length * Math.cos(angle3), y1 + k3 * length * Math.sin(angle3));
    context.stroke();
    var x3 = x1 + k3 * length * Math.cos(angle3);
    var y3 = y1 + k3 * length * Math.sin(angle3);

    while(limit3 >0){
        context.beginPath();
        context.moveTo(x3, y3);
        context.lineTo(x3 + k3 * length * Math.cos(angle3), y3 + k3* length * Math.sin(angle3));
        context.stroke();
        x3 = x3 + k3 * length * Math.cos(angle3);
        y3 = y3 + k3 * length * Math.sin(angle3);
        limit3 = limit3-1;
    }// end while
    
}// end sub_branch3

function sub_branch2(k2, angle2, x1,y1){
    var limit2 = limit;
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x1 + k2 * length * Math.cos(angle2), y1 + k2 * length * Math.sin(angle2));
    context.stroke();
    var x2 = x1 + k2 * length * Math.cos(angle2);
    var y2 = y1 + k2 * length * Math.sin(angle2);

    while(limit2 >0){
        context.beginPath();
        context.moveTo(x2, y2);
        context.lineTo(x2 + k2 * length * Math.cos(angle2), y2 + k2 * length * Math.sin(angle2));
        context.stroke();
        x2 = x2 + k2 * length * Math.cos(angle2);
        y2 = y2 + k2 * length * Math.sin(angle2);
        limit2 = limit2-1;
    }// end while
}// end sub_branch2

function sub_branch1(k1, angle1, x1,y1){
    var limit1 = limit;
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x1 + k1 * length * Math.cos(angle1), y1 + k1 * length * Math.sin(angle1));
    context.stroke();
    var x11 = x1 + k1 * length * Math.cos(angle1);
    var y11 = y1 + k1 * length * Math.sin(angle1);

    while(limit1 >0){
        context.beginPath();
        context.moveTo(x11, y11);
        context.lineTo(x11 + k1 * length * Math.cos(angle1), y11 + k1 * length * Math.sin(angle1));
        context.stroke();
        x11 = x11 + k1 * length * Math.cos(angle1);
        y11 = y11 + k1 * length * Math.sin(angle1);
        limit1 = limit1-1;
    }// end while
}// end sub_branch1
*/