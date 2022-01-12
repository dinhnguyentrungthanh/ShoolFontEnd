/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
export class ApiConstraint {
  public static readonly LOGIN: string = 'auth/login';
  public static readonly REGISTER: string = 'auth/register';
  public static readonly REFRESH: string = 'auth/refreshtoken';
  public static readonly RECOVER_PASSWORD: string = 'recover';

  public static readonly BLOCK: string = 'block';
  public static readonly BLOCK_ID: string = 'block/{0}';
  public static readonly BLOCK_BY_MAJOR: string = 'block/{0}/major';
  public static readonly BLOCK_BY_CLASS: string = 'block/{0}/class';
  public static readonly BLOCK_BY_URL: string = 'block/byurl/{0}';

  public static readonly USER: string = 'user';
  public static readonly USER_COUNT: string = 'user/{0}/count';

  public static readonly CLASS: string = 'class';
  public static readonly CLASS_ID: string = 'class/{0}';
  public static readonly CLASS_ID_USER: string = 'class/{0}/user';
  public static readonly CLASS_ID_USER_ID: string = 'class/{0}/user/{1}';

  public static readonly MAJOR: string = 'major';

  public static readonly MATHDESIGN: string = 'mathdesign';
  public static readonly MATHDESIGN_FROM_MAJOR_AND_BLOCK: string = 'mathdesign/major/{0}/block/{1}';

  public static readonly CHAPTER: string = 'chapter';

  public static readonly ROLE: string = 'role';

  public static readonly ROLEGROUP: string = 'rolegroup';

  public static readonly TEST_TYPE: string = 'test-type';
  public static readonly TEST_TYPE_ID: string = 'test-type/{0}';

  public static readonly TEST: string = 'test';
  public static readonly TEST_ID: string = 'test/{0}';

  public static readonly TEST_ESSAY: string = 'test/essay';
  public static readonly TEST_ESSAY_ID: string = 'test/essay/{0}';

  public static readonly POINT: string = 'point';
	public static readonly POINT_ID: string = 'point/{0}';
	public static readonly POINT_ID_STREAM: string = 'point/{0}/stream';
  public static readonly POINT_DETAIL: string = 'point_detail';

  public static readonly KNOWLEDGE: string = 'knowledge';
  public static readonly KNOWLEDGE_ID: string = 'knowledge/{0}';
  public static readonly KNOWLEDGE_BY_CHAPTER: string = 'knowledge/{0}/chapter';

  public static readonly SEARCH_MATHDESIGN_FROM_BLOCK: string = 'search/block/mathdesign';
  public static readonly SEARCH_CHAPTER_FROM_MATHDESIGN: string = 'search/mathdesign/chapter';
  public static readonly SEARCH_KNOWLEDGE_BY_FILTER: string = 'search/chapter';

  public static readonly CLIENT_ENPOINT_CHAPTER_F_BLOCK_F_MAJOR_F_MATHDESIGN: string = 'block/{0}/major/{1}/mathdesign/{2}/chapter';
  public static readonly CLIENT_ENPOINT_CHAPTER_F_BLOCK_F_MAJOR_F_MATHDESIGN_CHAPTER_KNOWLEDGE: string = 'block/{0}/major/{1}/mathdesign/{2}/chapter/{3}/knowledge/{4}';
  public static readonly API_ENPOINT_ID = '{0}';
  public static readonly API_ENPOINT_CHANGE_PASSWORD = 'changepws';
  public static readonly API_ENPOINT_CHANGE_PASSWORD_ADMIN = 'changepws/admin';

  public static readonly API_ENPOINT_USERNAME = 'user/{0}';
  public static readonly UPLOAD_FILE_AVATAR = 'media/{0}/avatar';

  public static readonly REVIEWQUESTION: string = 'reviewquestion';
  public static readonly REVIEWQUESTION_ID: string = 'reviewquestion/{0}';
}
