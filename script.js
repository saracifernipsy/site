(() => {
  const reveals = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: '0px 0px -10% 0px',
    }
  );

  reveals.forEach((el) => observer.observe(el));
})();

(() => {
  const form = document.querySelector('#contact-form');
  if (!form) {
    return;
  }

  const getFormData = () => {
    const email = form.getAttribute('data-email') || 'saraciferni@gmail.com';
    const subject = form.getAttribute('data-subject') || 'Richiesta colloquio';
    const getValue = (selector) => {
      const input = form.querySelector(selector);
      if (!input || typeof input.value !== 'string') {
        return '';
      }
      return input.value.trim();
    };

    const fields = {
      Nome: getValue('[name="Nome"]'),
      Email: getValue('[name="Email"]'),
      Telefono: getValue('[name="Telefono"]'),
      Disponibilita: getValue('[name="Disponibilita"]'),
      Messaggio: getValue('[name="Messaggio"]'),
    };

    const bodyLines = Object.entries(fields)
      .filter(([, value]) => value)
      .map(([label, value]) => `${label}: ${value}`);

    const plainBody = bodyLines.join('\n');
    return {
      email,
      subject,
      body: encodeURIComponent(plainBody),
      plainBody,
    };
  };

  const buildMailto = ({ email, subject, body }) =>
    `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${body}`;

  const buildWebmail = (provider, { email, subject, body }) => {
    if (provider === 'gmail') {
      return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${body}`;
    }
    if (provider === 'outlook') {
      return `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(email)}&subject=${encodeURIComponent(subject)}&body=${body}`;
    }
    return null;
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = getFormData();
    const mailto = buildMailto(data);
    window.location.href = mailto;
  });

  const webmailButtons = form.querySelectorAll('.webmail-btn');
  webmailButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const provider = button.getAttribute('data-webmail');
      const data = getFormData();
      const url = buildWebmail(provider, data);
      if (url) {
        window.open(url, '_blank', 'noopener');
      }
    });
  });
})();

(() => {
  const copyButton = document.querySelector('.copy-email');
  if (!copyButton) {
    return;
  }

  const defaultLabel = copyButton.textContent;

  copyButton.addEventListener('click', async () => {
    const email = copyButton.getAttribute('data-email');
    if (!email) {
      return;
    }

    try {
      await navigator.clipboard.writeText(email);
    } catch (error) {
      const tempInput = document.createElement('input');
      tempInput.value = email;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
    }

    copyButton.textContent = 'Email copiata';
    copyButton.setAttribute('disabled', 'disabled');
    setTimeout(() => {
      copyButton.textContent = defaultLabel;
      copyButton.removeAttribute('disabled');
    }, 2000);
  });
})();

(() => {
  const topBar = document.querySelector('.top-bar');
  const toggle = document.querySelector('.menu-toggle');
  const topMenu = document.querySelector('.top-menu');
  if (!topBar || !toggle || !topMenu) {
    return;
  }

  const closeMenu = () => {
    topBar.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    const isOpen = topBar.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  document.querySelectorAll('.top-menu a').forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });
})();
