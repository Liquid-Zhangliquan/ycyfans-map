#ifdef GL_ES
    precision highp float;
#endif
#define L length(c - .1*vec3(    // use: L x,y,z))
#define M(v)   max(0., v)

varying vec3 v_FragPos;
varying vec3 v_center;
uniform vec2 iResolution;
uniform float iTime;
uniform float iRadius;
void main()
{
    vec3 c = v_FragPos - v_center;
    vec3 k = 0.1 - 0.1 * step(0.007,abs(c));
    float x = L 0))*20., // x,y - polar coords
          y = mod(atan(c.y, c.x) + iTime, 6.28),
          d = M(.75 - y * .4),
          b = min( min(L -3,-1,v_center.z)), L 6,-4,v_center.z)) ), L 4,5,v_center.z)) )
        	+ .06 - y *.04;
    float red = b<.08 ? b * M(18.-13.*y) : .0;
    float blue = (x<iRadius*6.0 ? 0.25 +  M( cos(x+.8) -.95 ) * iRadius*0.6 + k.x*1.5 + k.y*1.5 + d * d+ M(.8 - y * (x+x+.3) ) :0.)+ M(1. - abs(x+x-iRadius*12.0));
    vec4 O1 = vec4(
        red ,0.1, blue, x < iRadius*6.0 ? (red + 0.0 + blue) / 0.5 : 0.0);
    vec4 O2 = vec4(red ,blue, 0.0, x < iRadius*6.0 ? (red + 0.0 + blue) / 0.5 : 0.0);
    gl_FragColor = O1 * 0.8 + O2*0.3;
}
