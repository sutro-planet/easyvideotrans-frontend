import Link from 'next/link';

export default function Cta() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="pb-12 md:pb-20">
          {/* CTA box */}
          <div
            className="rounded bg-blue-600 px-8 py-10 shadow-2xl md:px-12 md:py-16"
            data-aos="zoom-y-out"
          >
            <div className="flex flex-col items-center justify-between lg:flex-row">
              {/* CTA content */}
              <div className="mb-6 text-center lg:mb-0 lg:mr-16 lg:text-left">
                <h3 className="h3 mb-2 text-white">想上手试试？</h3>
                <p className="text-lg text-white opacity-75">
                  我们创建了一个PlayGround页面您可以玩玩。
                </p>
              </div>

              {/* CTA button */}
              <div>
                <Link
                  target={'_blank'}
                  className="btn bg-gradient-to-r from-blue-100 to-white text-blue-600"
                  href="/playground"
                >
                  快速尝试 PlayGround
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
