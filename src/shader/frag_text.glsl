#version 300 es
precision lowp float;

in vec4 vColor;
in vec2 vUV;

uniform sampler2D uSampler;

out vec4 fragColor;

void main(){
    vec4 col = texture(uSampler,vUV);
    fragColor = col;
}