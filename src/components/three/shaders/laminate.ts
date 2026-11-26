export const vertexShader = /* glsl */ `
attribute float rail;
uniform float stage;
varying vec3 vNormal;
varying float vRail;
vec3 skin(float t, float a, float r) {
  float s = r / 43.0 * 2.0 - 1.0;
  float twist = 1.5*t + .65 + .28*sin(2.0*t + .15);
  float face = .68*s + .0149*cos(a);
  float edge = (.12 + .018*cos(s*3.14159))*sin(a);
  float radius = 1.01 + face*cos(twist) - edge*sin(twist);
  float x=cos(t)*radius, y=sin(t)*radius*1.10;
  float z=face*sin(twist)+edge*cos(twist)+.42*sin(2.0*t-.3);
  float py=y*.84-z*.542;
  vec3 idea = vec3(x*.877-py*.48,x*.48+py*.877,y*.542+z*.84);
  // Link the tiers with a shared rail parameter, keeping the mesh topology
  // unchanged while the silhouette rolls, folds and finally condenses.
  float fine = .17*cos(a);
  float stack = .66*s + .0149*sin(a);
  float tr = t + .48*s;
  vec3 craft = vec3(cos(tr)*(1.18+fine), sin(tr)*(.92+fine),stack + .44*sin(2.0*tr));
  float squareR = pow(pow(abs(cos(t)),6.0)+pow(abs(sin(t)),6.0),-1.0/6.0);
  vec3 code = vec3(cos(t)*(squareR+fine),sin(t)*(squareR+fine)*.64,stack*1.65);
  float tilt = .58*s+.24;
  code.xy=mat2(cos(tilt),sin(tilt),-sin(tilt),cos(tilt))*code.xy;
  vec3 innovation = vec3((1.0+fine)*cos(tr), (1.0+fine)*sin(tr),stack+ .7*sin(3.0*tr+.65*s));
  craft.yz = mat2(.866,.5,-.5,.866)*craft.yz;
  code.yz = mat2(.72,.694,-.694,.72)*code.yz;
  innovation.yz = mat2(.89,.456,-.456,.89)*innovation.yz;
  vec3 p=mix(idea,craft,smoothstep(0.0,1.0,stage));
  p=mix(p,code,smoothstep(1.0,2.0,stage));
  return mix(p,innovation,smoothstep(2.0,3.0,stage));
}
void main(){
  float t=position.x, a=position.y;
  vec3 p=skin(t,a,rail);
  vec3 n=cross(skin(t+.0005,a,rail)-p,skin(t,a+.0005,rail)-p);
  vNormal=normalMatrix*normalize(n);
  vRail=rail;
  gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);
}`
export const fragmentShader = /* glsl */ `
varying vec3 vNormal;
varying float vRail;
void main(){
  vec3 n=normalize(vNormal);
  if(n.z<0.0)n=-n;
  vec3 r=reflect(vec3(0.,0.,-1.),n);
  float sky=smoothstep(-.68,1.,r.y);
  float strip=1.-smoothstep(.11,.40,abs(r.x+.32*r.y+.44));
  float top=1.-smoothstep(.12,.42,abs(r.y-.78));
  float edge=1.-smoothstep(.015,.085,abs(r.x-.79));
  float glint=strip*(.66+.34*smoothstep(-1.,.8,r.z))+top*.55+edge*.40;
  float l=.105+.43*sky+.89*glint+.18*pow(1.-n.z,2.);
  float teal=.11+.31*(1.-smoothstep(-.45,.75,r.y))*(1.-min(1.,glint));
  float accent=abs(vRail-9.5)<1.0 ? .22 : 0.;
  gl_FragColor=vec4(l*vec3(1.-teal-accent,.99+.26*accent,.98+.32*teal),1.);
}`
