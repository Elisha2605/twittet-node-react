import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './termsOfService.module.css';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';

const TermsOfService = () => {
    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <div className={styles.logoAndTitle}>
                    <FontAwesomeIcon
                        icon={faTwitter}
                        color={'var(--color-primary)'}
                        size={'2xl'}
                    />
                    <h2>(Fake Twitter app: Bacheclor Project)</h2>
                </div>
                <h1>Terms of Service:</h1>
                <h3>Acceptance of Terms</h3>
                <p>
                    By using this fake/clone Twitter app, you agree to be bound
                    by these Terms of Service. If you do not agree to these
                    terms, please refrain from using the app.
                </p>

                <h3>User Accounts</h3>
                <ol>
                    <li>
                        You may create a user account by signing up with a fake
                        email address and password.
                    </li>
                    <li>
                        You are responsible for maintaining the confidentiality
                        of your account credentials.
                    </li>
                    <li>
                        You agree not to use another person's account without
                        permission.
                    </li>
                </ol>

                <h3>Content</h3>
                <ol>
                    <li>
                        You are solely responsible for the content you post on
                        the app.
                    </li>
                    <li>
                        You agree not to post any illegal, harmful, or offensive
                        content.
                    </li>
                    <li>
                        We reserve the right to remove any content that violates
                        these terms.
                    </li>
                </ol>

                <h3>Intellectual Property</h3>
                <ol>
                    <li>
                        All intellectual property rights in the app belong to
                        the app developer.
                    </li>
                    <li>
                        You agree not to copy, distribute, or modify any part of
                        the app without permission.
                    </li>
                </ol>

                <h3>Disclaimer of Warranty</h3>
                <ol>
                    <li>
                        The app is provided on an "as is" and "as available"
                        basis.
                    </li>
                    <li>
                        We do not warrant that the app will be error-free or
                        uninterrupted.
                    </li>
                </ol>

                <h3>Limitation of Liability</h3>
                <p>
                    We are not liable for any direct, indirect, incidental, or
                    consequential damages arising from your use of the app.
                </p>

                <h1>Privacy Policy:</h1>

                <h3>Information Collection</h3>
                <ol>
                    <li>
                        We collect personal information (such as email addresses
                        and passwords) during the sign-up process.
                    </li>
                    <li>
                        We may also collect non-personal information (such as IP
                        addresses) for analytics purposes.
                    </li>
                </ol>

                <h3>Use of Information</h3>
                <ol>
                    <li>
                        We use the personal information you provide to create
                        and maintain your user account.
                    </li>
                    <li>
                        We may use non-personal information for analytics and
                        app improvement purposes.
                    </li>
                </ol>

                <h3>Cookies</h3>
                <ol>
                    <li>
                        We use cookies to enhance your experience and for
                        analytics purposes.
                    </li>
                    <li>
                        By using the app, you consent to the use of cookies in
                        accordance with this policy.
                    </li>
                </ol>

                <h3>Data Security</h3>
                <ol>
                    <li>
                        We take reasonable measures to protect the personal
                        information you provide.
                    </li>
                    <li>
                        However, we cannot guarantee the security of your data
                        transmitted over the internet.
                    </li>
                </ol>

                <h3>Third-Party Disclosure</h3>
                <p>
                    We do not sell or disclose your personal information to
                    third parties without your consent.
                </p>
            </div>
        </div>
    );
};

export default TermsOfService;
