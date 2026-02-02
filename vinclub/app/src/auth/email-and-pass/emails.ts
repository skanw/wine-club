import { type GetVerificationEmailContentFn, type GetPasswordResetEmailContentFn } from 'wasp/server/auth';

export const getVerificationEmailContent: GetVerificationEmailContentFn = ({ verificationLink }) => ({
  subject: 'Vérifiez votre email',
  text: `Cliquez sur le lien ci-dessous pour vérifier votre email : ${verificationLink}`,
  html: `
        <p>Cliquez sur le lien ci-dessous pour vérifier votre email</p>
        <a href="${verificationLink}">Vérifier l'email</a>
    `,
});

export const getPasswordResetEmailContent: GetPasswordResetEmailContentFn = ({ passwordResetLink }) => ({
  subject: 'Réinitialisation du mot de passe',
  text: `Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe : ${passwordResetLink}`,
  html: `
        <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe</p>
        <a href="${passwordResetLink}">Réinitialiser le mot de passe</a>
    `,
});
