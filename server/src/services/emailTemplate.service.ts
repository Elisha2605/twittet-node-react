import EmailTemplate from 'src/models/emailTemplate.model';
import he from 'he';

export const getEmailTemplateByName = async (name: string) => {
    const template = (await EmailTemplate.find({ name: name }))[0];
    const html = he.decode(template.html);
    return {
        sender: template.sender,
        subject: template.subject,
        html,
    };
};

export const injectVariables = (html: string, variables?: any) => {
    html = html.replace('${footerUrl}', process.env.BASE_URL);
    if (variables !== undefined && variables !== null) {
        for (const key of Object.keys(variables)) {
            html = html.replace('${' + key + '}', variables[key]);
        }
    }
    return html;
};
