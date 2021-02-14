export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  /** The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text. */
  String: string;
  Boolean: boolean;
  /** The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1. */
  Int: number;
  /** The `Float` scalar type represents signed double-precision fractional values as specified by [IEEE 754](https://en.wikipedia.org/wiki/IEEE_floating_point). */
  Float: number;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
};

export type Query = {
  __typename?: 'Query';
  contentDocs?: Maybe<Array<Maybe<ContentDocument>>>;
  yodaBridgeDocs?: Maybe<Array<Maybe<YodaBridgeDocs>>>;
};

export type ContentDocument = {
  __typename?: 'ContentDocument';
  slug?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  position: Scalars['Int'];
  category?: Maybe<Scalars['String']>;
  toc?: Maybe<Array<Maybe<ContentDocument_Toc>>>;
  body?: Maybe<ContentDocument_Body>;
  dir?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
  extension?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  to?: Maybe<Scalars['String']>;
  features?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type ContentDocument_Toc = {
  __typename?: 'ContentDocument_Toc';
  id?: Maybe<Scalars['String']>;
  depth?: Maybe<Scalars['Float']>;
  text?: Maybe<Scalars['String']>;
};

export type ContentDocument_Body = {
  __typename?: 'ContentDocument_Body';
  type?: Maybe<Scalars['String']>;
  tag?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
  children?: Maybe<Array<Maybe<ContentDocument_Body>>>;
  props?: Maybe<Scalars['JSON']>;
};


export type YodaBridgeDocs = {
  __typename?: 'YodaBridgeDocs';
  id?: Maybe<Scalars['String']>;
  bridgeName?: Maybe<Scalars['String']>;
  nameSpace?: Maybe<Scalars['String']>;
  intro?: Maybe<Scalars['String']>;
  contacts?: Maybe<YodaBridgeDocs_Contacts>;
  supportVersion?: Maybe<YodaBridgeDocs_SupportVersion>;
  tags?: Maybe<Array<Maybe<Scalars['String']>>>;
  md?: Maybe<Scalars['String']>;
};

export type YodaBridgeDocs_Contacts = {
  __typename?: 'YodaBridgeDocs_Contacts';
  fe?: Maybe<Scalars['String']>;
  android?: Maybe<Scalars['String']>;
  wangwu?: Maybe<Scalars['String']>;
};

export type YodaBridgeDocs_SupportVersion = {
  __typename?: 'YodaBridgeDocs_SupportVersion';
  android?: Maybe<Scalars['String']>;
  ios?: Maybe<Scalars['String']>;
};
