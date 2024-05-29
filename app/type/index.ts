export interface ITranslateSrtIProp {
  video_id: string;
  source_lang: string;
  translate_vendor: string;
  translate_key: string;
}

export interface IGenerateTTSProp {
  video_id: string;
  tts_vendor: string;
  tts_key: string;
  tts_character: string;
}
