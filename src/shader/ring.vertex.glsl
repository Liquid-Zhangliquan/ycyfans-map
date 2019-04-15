#ifdef GL_ES
    precision highp float;
#endif
    attribute vec3 aPosition;

    uniform vec3 center;
    uniform mat4 projViewModelMatrix;
    uniform mat4 modelMatrix;
    varying vec3 v_FragPos;
    varying vec3 v_center;
    void main(){
       gl_Position=projViewModelMatrix*vec4(aPosition,1.);
       vec4 worldPos = modelMatrix * vec4(aPosition, 1.0);
       v_FragPos = worldPos.xyz;
       v_center = (modelMatrix * vec4(center, 1.0)).xyz;
    }
