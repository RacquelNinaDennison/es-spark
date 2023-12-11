export type gptGeneratorRequest = {
	userData: string;
	threadID: string | null;
};

export type gptGeneratorResponse = {
	message: string;
	threadId: string;
};

export type gptPrompt = {
	nameOfCompany: string;
	mainColor: string;
	secondaryColor: string;
	theme: string;
	storeDescription: string;
	mainHeading: string;
	subHeading: string;
	webPageType: string;
	email: string;
	product: string;
};

export type gptBlogPrompt = {
	nameOfCompany: string;
	mainColor: string;
	secondaryColor: string;
	email: string;
	blogDescription: string;
	mainBlogHeading: string;
	subHeading: string;
	postType: string;
	blogName: string;
	webPageType: string;
};

export type gptBuisnessPrompt = {
	nameOfCompany: string;
	mainColor: string;
	secondaryColor: string;
	email: string;
	companyDescription: string;
	mainBlogHeading: string;
	subHeading: string;
	companyStory: string;
	companyServices: string;
	webPageType: string;
};
