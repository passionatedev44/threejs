"use strict";


var dissolve_mat=[]; // ������� dissolve ���������
var dissolve_name=[]; // ��������� ����������


// ____________________ ������ ���� ��������� FRAGMENT ������� ____________________


var dissolve_r_tex=[
"uniform sampler2D noise_rnd;",
"uniform vec3 color_0;",
"uniform float size,dt;",
].join("\n");


var dissolve_r_diffuse=[
"vec4 v_map=texture2D(map,vUv);",
"float n=texture2D(noise_rnd,vUv).x-dt;",
"if(n<0.0){ discard; }",
"if(n<size){ v_map.rgb=color_0; }",
"vec4 diffuseColor=mapTexelToLinear(v_map);",
].join("\n");


function dissolve_f_fs(dissolve_k){

// ��������� � ������ ����������� ����� �������, ��������, ��������
dissolve_name[dissolve_k].fs=dissolve_r_tex+"\n"+dissolve_name[dissolve_k].fs;
// �������� ������� ����� �������� (MAP) �� ����. ����� �Ĩ� ����������� ������� � ������������ � RGBA ������. � ������ ������� �� ���������
dissolve_name[dissolve_k].fs=dissolve_name[dissolve_k].fs.replace("#include <map_fragment>",dissolve_r_diffuse);
// ������� ������ ��� �������� ������
dissolve_name[dissolve_k].fs=dissolve_name[dissolve_k].fs.replace("vec4 diffuseColor = vec4( diffuse, opacity );","");


// ������� �������� � ������� ����������


dissolve_mat[dissolve_k]={
uniforms:dissolve_name[dissolve_k].u,
vertexShader:dissolve_name[dissolve_k].vs,
fragmentShader:dissolve_name[dissolve_k].fs,
lights:true,
fog:dissolve_name[dissolve_k].fog,
defines:{USE_MAP:true}
};


// ��������� lights ��� ��������� basic
if(dissolve_name[dissolve_k].mat=="basic"){
dissolve_mat[dissolve_k].lights=false;
}


}


// ����������� ���������


function dissolve_f_m(dissolve_ai,dissolve_au){


dissolve_mat[dissolve_ai].uniforms=dissolve_au;


// ���������� ���������� derivatives
if(
(dissolve_au.bumpMap!=undefined && dissolve_au.bumpMap.value!=null) ||
(dissolve_au.normalMap!=undefined && dissolve_au.normalMap.value!=null)
){
dissolve_mat[dissolve_ai].extensions={ derivatives:true };
}


// ���������� ���������
if(dissolve_au.bumpMap!=undefined && dissolve_au.bumpMap.value!=null){ dissolve_mat[dissolve_ai].defines.USE_BUMPMAP=true; }
if(dissolve_au.normalMap!=undefined && dissolve_au.normalMap.value!=null){ dissolve_mat[dissolve_ai].defines.USE_NORMALMAP=true; }
if(dissolve_au.emissiveMap!=undefined && dissolve_au.emissiveMap.value!=null){ dissolve_mat[dissolve_ai].defines.USE_EMISSIVEMAP=true; }
dissolve_mat[dissolve_ai].defines.USE_COLOR=true;
if(dissolve_au.envMap!=undefined && dissolve_au.envMap.value!=null){
dissolve_mat[dissolve_ai].defines.USE_ENVMAP=true;
dissolve_mat[dissolve_ai].defines.ENVMAP_TYPE_CUBE=true;
dissolve_mat[dissolve_ai].defines.ENVMAP_MODE_REFLECTION=true;
}
if(dissolve_au.specularMap!=undefined && dissolve_au.specularMap.value!=null){ dissolve_mat[dissolve_ai].defines.USE_SPECULARMAP=true; }
if(dissolve_au.roughnessMap!=undefined && dissolve_au.roughnessMap.value!=null){ dissolve_mat[dissolve_ai].defines.USE_ROUGHNESSMAP=true; }
if(dissolve_au.metalnessMap!=undefined && dissolve_au.metalnessMap.value!=null){ dissolve_mat[dissolve_ai].defines.USE_METALNESSMAP=true; }
}





//____________________ ��������� DISSOLVE EFFECT ____________________
//____________________ ��������� DISSOLVE EFFECT ____________________
//____________________ ��������� DISSOLVE EFFECT ____________________


//____________________ ������� �������� DISSOLVE d_robot_1 ____________________



function dissolve_m_robot_1(){


var dissolve_i="d_robot_1";  // ��� ���������


dissolve_name[dissolve_i]={
// ����� 4 ���� ����� �������� ����� ������������: basic,lambert,phong,standard,physical
mat:"standard",
lib:THREE.ShaderLib["standard"].uniforms,
vs:THREE.ShaderLib.standard.vertexShader,
fs:THREE.ShaderLib.standard.fragmentShader,
fog:true, // ������� ������ true �������� ��� false ���������
u:{} // ��������� UNIFORMS. ��������� �� ����
}


dissolve_f_fs(dissolve_i);
var dissolve_d=dissolve_name[dissolve_i];


dissolve_d.u=THREE.UniformsUtils.merge([
dissolve_d.lib,
{
noise_rnd:{type:"t",value:null}, // �������� ����
color_0:{type:'c',value:new THREE.Color(0x00ff00)}, // ���� �� ���������
color_1:{type:'c',value:new THREE.Color(0x00ff00)}, // ���� ����������
color_2:{type:'c',value:new THREE.Color(0xffc000)}, // ���� ������������
size:{type:'f',value:0.01}, // ������ �������
dt:{type:'f',value:1.0}, // ��������� ��������
w:{type:'f',value:-0.01}, // ����������� � ��������
}
]
);


dissolve_d.u.map.value=tex["robot"]; // �������� ��������
dissolve_d.u.noise_rnd.value=tex["noise_rnd"]; // �������� ����. ����� � �������� �������� ��������


if(dissolve_d.u.specular!=undefined){ dissolve_d.u.specular.value=new THREE.Color(0xffffff); } // ���� ������
if(dissolve_d.u.shininess!=undefined){ dissolve_d.u.shininess.value=80; } // ����� ��� PHONG
if(dissolve_d.u.roughness!=undefined){ dissolve_d.u.roughness.value=0.1; }  // ����� ��� STANDARD � PHYSICAl
if(dissolve_d.u.metalness!=undefined){ dissolve_d.u.metalness.value=0.7; }  // ������������� ��� STANDARD � PHYSICAl
if(dissolve_d.u.reflectivity!=undefined){ dissolve_d.u.reflectivity.value=1; } // ������� ��������� ��� envMap


// ���� �������� �� ����� - ����� null


if(dissolve_d.u.bumpMap!=undefined){
dissolve_d.u.bumpMap.value=null;
dissolve_d.u.bumpScale.value=1;
}
if(dissolve_d.u.normalMap!=undefined){
dissolve_d.u.normalMap.value=tex["robot_n"];
dissolve_d.u.normalScale.value={x:1,y:1};
}
if(dissolve_d.u.emissiveMap!=undefined){
dissolve_d.u.emissive.value=new THREE.Color(0xff0000);
dissolve_d.u.emissiveMap.value=tex["robot_e"];
dissolve_d.u.emissiveIntensity=1;
}
if(dissolve_d.u.envMap!=undefined){
dissolve_d.u.envMap.value=null;
}
if(dissolve_d.u.specularMap!=undefined){
dissolve_d.u.specularMap.value=null;
}
if(dissolve_d.u.roughnessMap!=undefined){
dissolve_d.u.roughnessMap.value=null;
}
if(dissolve_d.u.metalnessMap!=undefined){
dissolve_d.u.metalnessMap.value=null;
}


dissolve_f_m(dissolve_i,dissolve_d.u); // ������������ ��������


}


//____________________ ������� �������� DISSOLVE d_robot_2 ____________________


function dissolve_m_robot_2(){


var dissolve_i="d_robot_2";  // ��� ���������


dissolve_name[dissolve_i]={
// ����� 4 ���� ����� �������� ����� ������������: basic,lambert,phong,standard
mat:"basic",
lib:THREE.ShaderLib["basic"].uniforms,
vs:THREE.ShaderLib.basic.vertexShader,
fs:THREE.ShaderLib.basic.fragmentShader,
fog:true, // ������� ������ true �������� ��� false ���������
u:{} // ��������� UNIFORMS. ��������� �� ����
}


dissolve_f_fs(dissolve_i);
var dissolve_d=dissolve_name[dissolve_i];


dissolve_d.u=THREE.UniformsUtils.merge([
dissolve_d.lib,
{
noise_rnd:{type:"t",value:null}, // �������� ����
color_0:{type:'c',value:new THREE.Color(0xff8000)}, // ���� �� ���������
color_1:{type:'c',value:new THREE.Color(0xff8000)}, // ���� ����������
color_2:{type:'c',value:new THREE.Color(0xffffff)}, // ���� ������������
size:{type:'f',value:0.05}, // ������ �������
dt:{type:'f',value:1.0}, // ��������� ��������
w:{type:'f',value:-0.01}, // ����������� � ��������
}
]
);


dissolve_d.u.map.value=tex["robot"]; // �������� ��������
dissolve_d.u.noise_rnd.value=tex["noise_rnd"]; // �������� ����. ����� � �������� �������� ��������


if(dissolve_d.u.specular!=undefined){ dissolve_d.u.specular.value=new THREE.Color(0xffffff); } // ���� ������
if(dissolve_d.u.shininess!=undefined){ dissolve_d.u.shininess.value=80; } // ����� ��� PHONG
if(dissolve_d.u.roughness!=undefined){ dissolve_d.u.roughness.value=0.1; }  // ����� ��� STANDARD � PHYSICAl
if(dissolve_d.u.metalness!=undefined){ dissolve_d.u.metalness.value=0.5; }  // ������������� ��� STANDARD � PHYSICAl
if(dissolve_d.u.reflectivity!=undefined){ dissolve_d.u.reflectivity.value=1; } // ������� ��������� ��� envMap


// ���� �������� �� ����� - ����� null


if(dissolve_d.u.bumpMap!=undefined){
dissolve_d.u.bumpMap.value=null;
dissolve_d.u.bumpScale.value=1;
}
if(dissolve_d.u.normalMap!=undefined){
dissolve_d.u.normalMap.value=tex["robot_n"];
dissolve_d.u.normalScale.value={x:1,y:1};
}
if(dissolve_d.u.emissiveMap!=undefined){
dissolve_d.u.emissive.value=new THREE.Color(0x000000);
dissolve_d.u.emissiveMap.value=tex["robot_e"];
dissolve_d.u.emissiveIntensity=1;
}
if(dissolve_d.u.envMap!=undefined){
dissolve_d.u.envMap.value=null;
}
if(dissolve_d.u.specularMap!=undefined){
dissolve_d.u.specularMap.value=null;
}
if(dissolve_d.u.roughnessMap!=undefined){
dissolve_d.u.roughnessMap.value=null;
}
if(dissolve_d.u.metalnessMap!=undefined){
dissolve_d.u.metalnessMap.value=null;
}


dissolve_f_m(dissolve_i,dissolve_d.u); // ������������ ��������


}


//____________________ ������� �������� DISSOLVE d_wall_1 ____________________



function dissolve_m_wall_1(){


var dissolve_i="d_wall_1";  // ��� ���������


dissolve_name[dissolve_i]={
// ����� 4 ���� ����� �������� ����� ������������: basic,lambert,phong,standard
mat:"standard",
lib:THREE.ShaderLib["standard"].uniforms,
vs:THREE.ShaderLib.standard.vertexShader,
fs:THREE.ShaderLib.standard.fragmentShader,
fog:true, // ������� ������ true �������� ��� false ���������
u:{} // ��������� UNIFORMS. ��������� �� ����
}


dissolve_f_fs(dissolve_i);
var dissolve_d=dissolve_name[dissolve_i];


dissolve_d.u=THREE.UniformsUtils.merge([
dissolve_d.lib,
{
noise_rnd:{type:"t",value:null}, // �������� ����
color_0:{type:'c',value:new THREE.Color(0xff0000)}, // ���� �� ���������
color_1:{type:'c',value:new THREE.Color(0xff8000)}, // ���� ����������
color_2:{type:'c',value:new THREE.Color(0xff0000)}, // ���� ������������
size:{type:'f',value:0.006}, // ������ �������
dt:{type:'f',value:0.0}, // ��������� ��������
w:{type:'f',value:0.002}, // ����������� � ��������
}
]
);


dissolve_d.u.map.value=tex["wall"]; // �������� ��������
dissolve_d.u.noise_rnd.value=tex["noise_door"]; // �������� ����. ����� � �������� �������� ��������


if(dissolve_d.u.specular!=undefined){ dissolve_d.u.specular.value=new THREE.Color(0xffffff); } // ���� ������
if(dissolve_d.u.shininess!=undefined){ dissolve_d.u.shininess.value=80; } // ����� ��� PHONG
if(dissolve_d.u.roughness!=undefined){ dissolve_d.u.roughness.value=0.1; }  // ����� ��� STANDARD � PHYSICAl
if(dissolve_d.u.metalness!=undefined){ dissolve_d.u.metalness.value=0.7; }  // ������������� ��� STANDARD � PHYSICAl
if(dissolve_d.u.reflectivity!=undefined){ dissolve_d.u.reflectivity.value=1; } // ������� ��������� ��� envMap


// ���� �������� �� ����� - ����� null


if(dissolve_d.u.bumpMap!=undefined){
dissolve_d.u.bumpMap.value=null;
dissolve_d.u.bumpScale.value=1;
}
if(dissolve_d.u.normalMap!=undefined){
dissolve_d.u.normalMap.value=tex["wall_n"];
dissolve_d.u.normalScale.value={x:1,y:1};
}
if(dissolve_d.u.emissiveMap!=undefined){
dissolve_d.u.emissive.value=new THREE.Color(0x000000);
dissolve_d.u.emissiveMap.value=null;
dissolve_d.u.emissiveIntensity=1;
}
if(dissolve_d.u.envMap!=undefined){
dissolve_d.u.envMap.value=null;
}
if(dissolve_d.u.specularMap!=undefined){
dissolve_d.u.specularMap.value=null;
}
if(dissolve_d.u.roughnessMap!=undefined){
dissolve_d.u.roughnessMap.value=null;
}
if(dissolve_d.u.metalnessMap!=undefined){
dissolve_d.u.metalnessMap.value=null;
}


dissolve_f_m(dissolve_i,dissolve_d.u); // ������������ ��������


}


//____________________ ������� �������� DISSOLVE d_wall_2 ____________________



function dissolve_m_wall_2(){


var dissolve_i="d_wall_2";  // ��� ���������


dissolve_name[dissolve_i]={
// ����� 4 ���� ����� �������� ����� ������������: basic,lambert,phong,standard
mat:"standard",
lib:THREE.ShaderLib["standard"].uniforms,
vs:THREE.ShaderLib.standard.vertexShader,
fs:THREE.ShaderLib.standard.fragmentShader,
fog:true, // ������� ������ true �������� ��� false ���������
u:{} // ��������� UNIFORMS. ��������� �� ����
}


dissolve_f_fs(dissolve_i);
var dissolve_d=dissolve_name[dissolve_i];


dissolve_d.u=THREE.UniformsUtils.merge([
dissolve_d.lib,
{
noise_rnd:{type:"t",value:null}, // �������� ����
color_0:{type:'c',value:new THREE.Color(0xff8000)}, // ���� �� ���������
color_1:{type:'c',value:new THREE.Color(0xff8000)}, // ���� ����������
color_2:{type:'c',value:new THREE.Color(0xff8000)}, // ���� ������������
size:{type:'f',value:0.1}, // ������ �������
dt:{type:'f',value:0.0}, // ��������� ��������
w:{type:'f',value:0.002}, // ����������� � ��������
}
]
);


dissolve_d.u.map.value=tex["wall"]; // �������� ��������
dissolve_d.u.noise_rnd.value=tex["noise_crack"]; // �������� ����. ����� � �������� �������� ��������


if(dissolve_d.u.specular!=undefined){ dissolve_d.u.specular.value=new THREE.Color(0xffffff); } // ���� ������
if(dissolve_d.u.shininess!=undefined){ dissolve_d.u.shininess.value=80; } // ����� ��� PHONG
if(dissolve_d.u.roughness!=undefined){ dissolve_d.u.roughness.value=0.1; }  // ����� ��� STANDARD � PHYSICAl
if(dissolve_d.u.metalness!=undefined){ dissolve_d.u.metalness.value=0.7; }  // ������������� ��� STANDARD � PHYSICAl
if(dissolve_d.u.reflectivity!=undefined){ dissolve_d.u.reflectivity.value=1; } // ������� ��������� ��� envMap


// ���� �������� �� ����� - ����� null


if(dissolve_d.u.bumpMap!=undefined){
dissolve_d.u.bumpMap.value=null;
dissolve_d.u.bumpScale.value=1;
}
if(dissolve_d.u.normalMap!=undefined){
dissolve_d.u.normalMap.value=tex["wall_n"];
dissolve_d.u.normalScale.value={x:1,y:1};
}
if(dissolve_d.u.emissiveMap!=undefined){
dissolve_d.u.emissive.value=new THREE.Color(0x000000);
dissolve_d.u.emissiveMap.value=null;
dissolve_d.u.emissiveIntensity=1;
}
if(dissolve_d.u.envMap!=undefined){
dissolve_d.u.envMap.value=null;
}
if(dissolve_d.u.specularMap!=undefined){
dissolve_d.u.specularMap.value=null;
}
if(dissolve_d.u.roughnessMap!=undefined){
dissolve_d.u.roughnessMap.value=null;
}
if(dissolve_d.u.metalnessMap!=undefined){
dissolve_d.u.metalnessMap.value=null;
}


dissolve_f_m(dissolve_i,dissolve_d.u); // ������������ ��������


}


//____________________ ������� ��������� �������� DISSOLVE ��� ������ ������ ����� ____________________


function dissolve_m_spider(dissolve_n,dissolve_c_0,dissolve_c_1,dissolve_c_2,dissolve_size,dissolve_dt,dissolve_w){


var dissolve_i=dissolve_n;  // ��� ���������


dissolve_name[dissolve_i]={
// ����� 4 ���� ����� �������� ����� ������������: basic,lambert,phong,standard
mat:"phong",
lib:THREE.ShaderLib["phong"].uniforms,
vs:THREE.ShaderLib.phong.vertexShader,
fs:THREE.ShaderLib.phong.fragmentShader,
fog:true, // ������� ������ true �������� ��� false ���������
u:{} // ��������� UNIFORMS. ��������� �� ����
}


dissolve_f_fs(dissolve_i);
var dissolve_d=dissolve_name[dissolve_i];


dissolve_d.u=THREE.UniformsUtils.merge([
dissolve_d.lib,
{
noise_rnd:{type:"t",value:null}, // �������� ����
color_0:{type:'c',value:dissolve_c_0}, // ���� �� ���������
color_1:{type:'c',value:dissolve_c_1}, // ���� ����������
color_2:{type:'c',value:dissolve_c_2}, // ���� ������������
size:{type:'f',value:dissolve_size}, // ������ �������
dt:{type:'f',value:dissolve_dt}, // ��������� ��������
w:{type:'f',value:dissolve_w}, // ����������� � ��������
}
]
);


dissolve_d.u.map.value=tex["spider"]; // �������� ��������
dissolve_d.u.noise_rnd.value=tex["noise_rnd"]; // �������� ����. ����� � �������� �������� ��������


if(dissolve_d.u.specular!=undefined){ dissolve_d.u.specular.value=new THREE.Color(0xffffff); } // ���� ������
if(dissolve_d.u.shininess!=undefined){ dissolve_d.u.shininess.value=80; } // ����� ��� PHONG
if(dissolve_d.u.roughness!=undefined){ dissolve_d.u.roughness.value=0.1; }  // ����� ��� STANDARD � PHYSICAl
if(dissolve_d.u.metalness!=undefined){ dissolve_d.u.metalness.value=0.5; }  // ������������� ��� STANDARD � PHYSICAl
if(dissolve_d.u.reflectivity!=undefined){ dissolve_d.u.reflectivity.value=1; } // ������� ��������� ��� envMap


// ���� �������� �� ����� - ����� null


if(dissolve_d.u.bumpMap!=undefined){
dissolve_d.u.bumpMap.value=null;
dissolve_d.u.bumpScale.value=1;
}
if(dissolve_d.u.normalMap!=undefined){
dissolve_d.u.normalMap.value=tex["spider_n"];
dissolve_d.u.normalScale.value={x:1,y:1};
}
if(dissolve_d.u.emissiveMap!=undefined){
dissolve_d.u.emissive.value=new THREE.Color(0x000000);
dissolve_d.u.emissiveMap.value=null;
dissolve_d.u.emissiveIntensity=1;
}
if(dissolve_d.u.envMap!=undefined){
dissolve_d.u.envMap.value=null;
}
if(dissolve_d.u.specularMap!=undefined){
dissolve_d.u.specularMap.value=null;
}
if(dissolve_d.u.roughnessMap!=undefined){
dissolve_d.u.roughnessMap.value=null;
}
if(dissolve_d.u.metalnessMap!=undefined){
dissolve_d.u.metalnessMap.value=null;
}


dissolve_f_m(dissolve_i,dissolve_d.u); // ������������ ��������


}
